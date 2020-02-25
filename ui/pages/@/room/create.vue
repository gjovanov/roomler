<template>
  <client-only>
    <v-layout>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="8"
        >
          <v-card>
            <v-card-title>
              Create a Room
            </v-card-title>
            <v-card-text>
              <room-manage
                :parent-room="parentRoom"
                @create="create"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </client-only>
</template>

<script>
import {
  handleSuccess
} from '@/services/ajax-handlers'
import RoomManage from '@/components/room/room-manage'

export default {
  middleware: 'authenticated',
  components: {
    RoomManage
  },
  computed: {
    parentRoom () {
      const result = this.$store.state.api.room.rooms.find(r => r.path === this.$route.query.parent)
      return result
    }
  },
  methods: {
    async create (room, media) {
      // 1. create the room in Janus
      // 2. create the room in our DB

      const janusPayload = Object.assign({}, media)
      janusPayload.audiocodec = janusPayload.audiocodecs.join(',')
      janusPayload.videocodec = janusPayload.videocodecs.join(',')
      janusPayload.is_private = !room.is_open
      janusPayload.description = room.name
      janusPayload.permanent = true
      const janusResponse = await this.$store.dispatch('api/janus/videoroom/createRoom', janusPayload)
      if (janusResponse.videoroom === 'created') {
        media.roomid = janusResponse.room
        const payload = {
          name: room.name,
          description: room.description,
          is_open: room.is_open,
          tags: room.tags,
          media
        }
        payload.media.audiocodec = payload.media.audiocodecs.join(',')
        payload.media.videocodec = payload.media.videocodecs.join(',')

        if (this.parentRoom) {
          payload.parent_id = this.parentRoom._id
        }
        const createResponse = await this.$store.dispatch('api/room/create', payload)
        if (!createResponse.hasError) {
          const savedRoom = createResponse.result
          handleSuccess('The room was created successfully. It\'s more fun with friends so let\'s invite some', this.$store.commit)
          this.$router.push({ path: `/${savedRoom.path}` })
        }
      }
    }
  }
}
</script>
