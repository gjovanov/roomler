<template>
  <client-only>
    <v-layout>
      <v-row
        v-if="room"
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="8"
        >
          <v-card>
            <v-card-title>
              {{ $t('pages.@.room.edit.updateRoom') }} '{{ room.name }}'
            </v-card-title>
            <v-card-text>
              <room-manage
                :room="room"
                :has-update="true"
                @update="update"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </client-only>
</template>

<script>
import RoomManage from '@/components/room/room-manage'
import rdiff from 'recursive-diff'

export default {
  components: {
    RoomManage
  },
  middleware: 'authenticated',
  computed: {
    room () {
      const result = this.$store.state.api.room.rooms.find(r => r.path === this.$route.query.room)
      return result
    }
  },
  created () {
    const selectedRoom = this.$store.getters['api/room/selectedRoom'](this.$route.query.room)
    this.$store.commit('api/room/setRoom', selectedRoom, { root: true })
  },
  methods: {
    async update (room, media) {
      // 1. if media changes, then deleted and recreate Janus room
      // 2. update the room media in the DB

      const diff = rdiff.getDiff(this.room, room)
      const update = { }
      const hasTags = diff.find(d => d.path.includes('tags'))
      if (hasTags) {
        update.tags = room.tags
      }
      diff
        .filter(d => !d.path.includes('tags'))
        .forEach((d) => {
          const path = d.path.join('.')
          update[path] = d.val
        })

      if (diff.find(d => d.path.includes('media'))) {
        let janusResponse
        try {
          janusResponse = await this.$store.dispatch('api/janus/videoroom/destroyRoom', { room: media.roomid, secret: media.secret, permanent: media.permanent })
        } catch (e) {
          this.$consola.error(e)
        }

        if (janusResponse && janusResponse.videoroom === 'destroyed') {
          const janusPayload = Object.assign({}, media)
          janusPayload.audiocodec = janusPayload.audiocodecs.join(',')
          janusPayload.videocodec = janusPayload.videocodecs.join(',')
          janusPayload.is_private = !room.is_open
          janusPayload.description = room.name
          janusPayload.permanent = true
          try {
            janusResponse = await this.$store.dispatch('api/janus/videoroom/createRoom', janusPayload)
            if (janusResponse && janusResponse.videoroom === 'created') {
              media.roomid = janusResponse.room
              update['media.roomid'] = janusResponse.room
            }
          } catch (e) {
            this.$consola.error(e)
          }
        }
      }
      const updatePayload = { id: room._id, update }
      const updateResponse = await this.$store.dispatch('api/room/update', updatePayload)
      if (!updateResponse.hasError) {
        const savedRoom = updateResponse.result.room
        this.$router.push({ path: this.localePath({ name: 'room-chat', params: { room: `${savedRoom.path}` } }) })
      }
    }
  }
}
</script>
