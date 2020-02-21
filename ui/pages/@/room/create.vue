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
                @updateValid="updateValid"
                @create="create"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!valid"
                color="primary"
                @click="create()"
              >
                Create
              </v-btn>
            </v-card-actions>
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
  data () {
    return {
      valid: false
    }
  },
  computed: {
    parentRoom () {
      const result = this.$store.state.api.room.rooms.find(r => r.path === this.$route.query.parent)
      return result
    }
  },
  methods: {
    updateValid (newVal) {
      this.valid = newVal
    },
    async create (room, media) {
      // 1. create a room in our DB via the /api/room/create
      // 2. create a room in Janus
      // 3. update the Janus roomid in our DB via /api/room/update
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
        payload.parent_name = this.parentRoom.name
        payload.parent_path = this.parentRoom.path
      }
      const createResponse = await this.$store.dispatch('api/room/create', payload)
      if (!createResponse.hasError) {
        let savedRoom = createResponse.result
        const janusPayload = Object.assign({}, media)
        janusPayload.audiocodec = janusPayload.audiocodecs.join(',')
        janusPayload.videocodec = janusPayload.videocodecs.join(',')
        janusPayload.is_private = !savedRoom.is_open
        janusPayload.description = savedRoom.name
        janusPayload.permanent = true
        const janusRoom = await this.$store.dispatch('api/janus/videoroom/createRoom', janusPayload)

        const updatePayload = { id: savedRoom._id, update: { 'media.roomid': janusRoom.room } }
        const updateResponse = await this.$store.dispatch('api/room/update', updatePayload)
        if (!updateResponse.hasError) {
          savedRoom = updateResponse.result
          handleSuccess('The room was created successfully. It\'s more fun with friends so let\'s invite some', this.$store.commit)
          this.$router.push({ path: `/${savedRoom.path}` })
        }
      }
    }
  }
}
</script>
