<template>
  <v-row>
    <v-col cols="12">
      <v-layout justify-center>
        <join-dialog :open="joinDialog" @join="join" @cancel="joinDialog = false" />
        <publish-dialog :open="publishDialog" @publish="publish" @cancel="publishDialog = false" />
        <extension-dialog :open="extensionDialog" @cancel="extensionDialog = false" />
        <v-tooltip v-if="!session" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="!session"
              v-on="on"
              @click="joinDialog = true"
              small
              fab
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
              v-on="on"
              @click="leave()"
              color="red"
              small
              fab
            >
              <v-icon>fa-power-off</v-icon>
            </v-btn>
          </template>
          <span>Hang up</span>
        </v-tooltip>
        <v-tooltip v-if="localHandle && !localHandle.screen" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="localHandle && !localHandle.screen"
              v-on="on"
              @click="shareScreen()"
              small
              fab
            >
              <v-icon>fa-share</v-icon>
            </v-btn>
          </template>
          <span>Share screen</span>
        </v-tooltip>
        <v-tooltip v-if="localHandle && localHandle.stream" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="localHandle && localHandle.stream"
              v-on="on"
              @click="unpublish()"
              small
              fab
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
              v-on="on"
              @click="publishDialog = true"
              small
              fab
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
import ExtensionDialog from '@/components/conference/extension-dialog'

export default {
  components: {
    JoinDialog,
    PublishDialog,
    ExtensionDialog
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
      publishDialog: false,
      extensionDialog: false
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
          video: media.video,
          audio: media.audio,
          screen: media.screen
        },
        media: this.room.media
      }
      janusPayload.media.room = janusPayload.media.roomid
      janusPayload.media.request = 'create'
      this.$emit('join', janusPayload)
    },
    async shareScreen () {
      if (!this.$Janus.isExtensionEnabled()) {
        this.extensionDialog = true
      } else {
        this.$store.commit('api/janus/videoroom/updates/setMedia', {
          handleDTO: this.localHandle,
          media: {
            audio: false,
            video: false,
            screen: true
          }
        })
        await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
          .then(jsep => this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep }))
      }
    },
    async publish (media) {
      this.publishDialog = false
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
      await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
        .then(jsep => this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep }))
    },
    async unpublish () {
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media: { audio: false, video: false, screen: false, data: false } })
      await this.$store.dispatch('api/janus/videoroom/api/unpublish', { handleDTO: this.localHandle })
    },
    leave () {
      this.$emit('leave')
    }
  }
}
</script>
