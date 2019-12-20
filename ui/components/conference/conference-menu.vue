<template>
  <v-row>
    <v-col cols="12">
      <v-layout justify-center>
        <join-dialog :open="joinDialog" @join="join" @cancel="joinDialog = false" />
        <publish-dialog :open="publishDialog" @publish="publish" @cancel="publishDialog = false" />
        <v-tooltip v-if="!session" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="!session"
              small
              fab
              v-on="on"
              @click="joinDialog = true"
            >
              <v-icon>fa-phone-volume</v-icon>
            </v-btn>
          </template>
          <span>Join conference</span>
        </v-tooltip>
        <v-tooltip v-if="session" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="session"
              color="red"
              small
              fab
              v-on="on"
              @click="leave()"
            >
              <v-icon>fa-power-off</v-icon>
            </v-btn>
          </template>
          <span>Hang up</span>
        </v-tooltip>
        <v-tooltip v-if="localHandle && !localHandle.sendScreen" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="localHandle && !localHandle.sendScreen"
              small
              fab
              v-on="on"
              @click="shareScreen()"
            >
              <v-icon>fa-share</v-icon>
            </v-btn>
          </template>
          <span>Unpublish</span>
        </v-tooltip>
        <v-tooltip v-if="localHandle && localHandle.stream" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="localHandle && localHandle.stream"
              small
              fab
              v-on="on"
              @click="unpublish()"
            >
              <v-icon>fa-minus-circle</v-icon>
            </v-btn>
          </template>
          <span>Unpublish</span>
        </v-tooltip>
        <v-tooltip v-if="localHandle && !localHandle.stream" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="localHandle && !localHandle.stream"
              small
              fab
              v-on="on"
              @click="publishDialog = true"
            >
              <v-icon>fa-bullhorn</v-icon>
            </v-btn>
          </template>
          <span>Publish</span>
        </v-tooltip>
      </v-layout>
    </v-col>
  </v-row>
</template>

<script>
import JoinDialog from '@/components/conference/join-dialog'
import PublishDialog from '@/components/conference/publish-dialog'

export default {
  components: {
    JoinDialog,
    PublishDialog
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    },
    session: {
      type: Object,
      default: null
    },
    localHandle: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      joinDialog: false,
      publishDialog: false
    }
  },
  methods: {
    join (media) {
      this.joinDialog = false
      const config = this.$store.state.api.config.config
      const janusPayload = {
        janus: {
          roomid: this.room.media.roomid,
          plugin: config.janusSettings.plugins.videoroom,
          display: this.user && this.user.username ? this.user.username : 'Anonymous',
          sendVideo: media.sendVideo,
          sendAudio: media.sendAudio
        },
        media: this.room.media
      }
      console.log(janusPayload.janus)
      janusPayload.media.room = janusPayload.media.roomid
      janusPayload.media.request = 'create'
      this.$emit('join', janusPayload)
    },
    shareScreen () {

    },
    async publish (media) {
      this.publishDialog = false
      this.$store.commit('api/janus/videoroom/handlers/setMedia', { handleDTO: this.localHandle, media })
      await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
        .then(jsep => this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep }))
    },
    async unpublish () {
      await this.$store.dispatch('api/janus/videoroom/api/unpublish', { handleDTO: this.localHandle })
    },
    leave () {
      this.$emit('leave')
    }
  }
}
</script>
