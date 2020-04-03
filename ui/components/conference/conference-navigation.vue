<template>
  <v-layout justify-center>
    <join-dialog :open="joinDialog" @join="join" @cancel="joinDialog = false" />
    <publish-dialog :open="publishDialog" @publish="publish" @cancel="publishDialog = false" />
    <extension-dialog :open="extensionDialog" @cancel="extensionDialog = false" />

    <v-tooltip v-if="!localHandle " bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="!localHandle"
          tile
          small
          class="v-btn--active"
          color="green"
          v-on="on"
          @click="joinDialog = true"
        >
          <v-icon small>
            fa-phone-volume
          </v-icon>
        </v-btn>
      </template>
      <span>Join the conference</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle && localHandle.stream" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle && localHandle.stream"
          tile
          small
          class="v-btn--active"
          v-on="on"
          @click="unpublish()"
        >
          <v-icon small>
            fa-stop-circle
          </v-icon>
        </v-btn>
      </template>
      <span>Unpublish</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle"
          tile
          small
          :text="localHandle.screen"
          class="v-btn--active"
          v-on="on"
          @click="toggleScreen()"
        >
          <v-icon v-if="!localHandle.screen">
            screen_share
          </v-icon>
          <v-icon v-if="localHandle.screen">
            stop_screen_share
          </v-icon>
        </v-btn>
      </template>
      <span v-if="localHandle.screen">Stop sharing screen</span>
      <span v-if="!localHandle.screen">Start sharing screen</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle"
          tile
          small
          :text="localHandle.video"
          class="v-btn--active"
          v-on="on"
          @click="toggleVideo()"
        >
          <v-icon v-if="localHandle.video">
            fa-video
          </v-icon>
          <v-icon v-if="!localHandle.video">
            fa-video-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="localHandle.video">Stop video</span>
      <span v-if="!localHandle.video">Start video</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle"
          tile
          small
          :text="localHandle.audio"
          class="v-btn--active"
          v-on="on"
          @click="toggleAudio()"
        >
          <v-icon v-if="localHandle.audio">
            fa-microphone
          </v-icon>
          <v-icon v-if="!localHandle.audio">
            fa-microphone-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="localHandle.audio">Mute microphone</span>
      <span v-if="!localHandle.audio">Unmute microphone</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle && !localHandle.stream" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle && !localHandle.stream"
          tile
          small
          class="v-btn--active"
          v-on="on"
          @click="publishDialog = true"
        >
          <v-icon small>
            fa-bullhorn
          </v-icon>
        </v-btn>
      </template>
      <span>Publish</span>
    </v-tooltip>

    <v-tooltip v-if="conferenceSession" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="conferenceSession"
          color="red"
          tile
          small
          class="v-btn--active"
          v-on="on"
          @click="leave()"
        >
          <v-icon small>
            fa-phone-slash
          </v-icon>
        </v-btn>
      </template>
      <span>Hang up</span>
    </v-tooltip>
  </v-layout>
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
    conferenceSession: {
      type: Object,
      default: null
    },
    conferenceRoom: {
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
  computed: {
    selectedRoom () {
      return this.conferenceRoom ? this.conferenceRoom : this.room
    },
    localHandle () {
      return this.$store.getters['api/conference/localHandle']
    }
  },
  methods: {
    join (media) {
      // await this.$router.push({ path: `/${this.room.path}` })
      // this.$store.commit('panel/set', { panel: 'left', value: false }, { root: true })

      this.joinDialog = false
      const config = this.$store.state.api.config.config
      const janusPayload = {
        janus: {
          roomid: this.selectedRoom.media.roomid,
          plugin: config.janusSettings.plugins.videoroom,
          display: this.user && this.user.username ? this.user.username : 'Anonymous',
          video: media.video,
          audio: media.audio,
          screen: media.screen
        },
        media: this.selectedRoom.media
      }
      janusPayload.media.room = janusPayload.media.roomid
      janusPayload.media.request = 'create'
      this.$store.dispatch('api/conference/join', { janusPayload, room: this.selectedRoom })
    },
    async toggleScreen () {
      if (!this.$Janus.isExtensionEnabled()) {
        this.extensionDialog = true
      } else {
        try {
          const media = {
            audio: this.localHandle.audio,
            video: false,
            screen: !this.localHandle.screen
          }
          const videoElem = document.getElementById('' + this.localHandle.id)
          if (videoElem) {
            videoElem.load() // show poster
            videoElem.setAttribute('controls', 'controls')
            videoElem.setAttribute('muted', 'muted')
            videoElem.muted = true
          }
          this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
          const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
          this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep })
        } catch (e) {
          console.log(e)
        }
      }
    },
    async toggleVideo () {
      try {
        const media = {
          audio: this.localHandle.audio,
          video: !this.localHandle.video,
          screen: false
        }
        const videoElem = document.getElementById('' + this.localHandle.id)
        if (videoElem) {
          videoElem.load() // show poster
          videoElem.setAttribute('controls', 'controls')
          videoElem.setAttribute('muted', 'muted')
          videoElem.muted = true
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
        const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
        this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep })
      } catch (e) {
        console.log(e)
      }
    },
    async toggleAudio () {
      try {
        const media = {
          audio: !this.localHandle.audio,
          video: this.localHandle.video,
          screen: this.localHandle.screen
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
        const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
        this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep })
      } catch (e) {
        console.log(e)
      }
    },
    async publish (media) {
      this.publishDialog = false
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
      const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
      this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep })
    },
    async unpublish () {
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media: { audio: false, video: false, screen: false, data: false } })
      await this.$store.dispatch('api/janus/videoroom/api/unpublish', { handleDTO: this.localHandle })
    },
    leave () {
      this.$store.commit('panel/set', { panel: 'left', value: true }, { root: true })
      this.$store.dispatch('api/conference/leave')
    }
  }
}
</script>
