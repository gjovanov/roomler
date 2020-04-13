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

    <v-tooltip v-if="localHandle && localHandle.stream" top left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle && localHandle.stream"
          tile
          small
          class="v-btn--active"
          v-on="{ on }"
          @click="unpublish()"
        >
          <v-icon small>
            fa-stop
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

    <v-menu
      v-if="localHandle"
      v-model="menus.video"
      bottom
      offset-y
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip v-if="localHandle" top left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              v-if="localHandle"
              tile
              small
              :text="localHandle.video && localHandle.isVideoMuted"
              class="v-btn--active"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon v-if="localHandle.video && !localHandle.isVideoMuted">
                fa-video
              </v-icon>
              <v-icon v-if="!(localHandle.video && !localHandle.isVideoMuted)">
                fa-video-slash
              </v-icon>
            </v-btn>
          </template>
          <span>Change video</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item
          v-if="localHandle.video && !localHandle.isVideoMuted"
          @click="toggleVideo()"
        >
          <v-list-item-title>
            <v-icon small>
              fa-video-slash
            </v-icon> Mute camera
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="!(localHandle.video && !localHandle.isVideoMuted)"
          @click="toggleVideo()"
        >
          <v-list-item-title>
            <v-icon small>
              fa-video
            </v-icon> Unmute camera
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-title>
            <v-icon small>
              fa-stop
            </v-icon> Stop camera
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      v-if="localHandle"
      v-model="menus.audio"
      bottom
      offset-y
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip v-if="localHandle" top left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              v-if="localHandle"
              tile
              small
              :text="localHandle.audio && localHandle.isAudioMuted"
              class="v-btn--active"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon v-if="localHandle.audio && !localHandle.isAudioMuted">
                fa-microphone
              </v-icon>
              <v-icon v-if="!(localHandle.audio && !localHandle.isAudioMuted)">
                fa-microphone-slash
              </v-icon>
            </v-btn>
          </template>
          <span>Change audio</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item
          v-if="localHandle.audio && !localHandle.isAudioMuted"
          @click="toggleAudio()"
        >
          <v-list-item-title>
            <v-icon small>
              fa-microphone-slash
            </v-icon> Mute microphone
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="!(localHandle.audio && !localHandle.isAudioMuted)"
          @click="toggleAudio()"
        >
          <v-list-item-title>
            <v-icon small>
              fa-microphone
            </v-icon> Unmute microphone
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-title>
            <v-icon small>
              fa-stop
            </v-icon> Stop microphone
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-tooltip v-if="localHandle && !localHandle.stream" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle && !localHandle.stream"
          color="green"
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
    },
    roomRoute: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      joinDialog: false,
      publishDialog: false,
      extensionDialog: false,
      menus: {
        unpublish: false,
        video: false,
        audio: false

      }
    }
  },
  computed: {
    conferencePosition () {
      return this.roomRoute === 'calls' ? 'center' : 'left'
    },
    selectedRoom () {
      return this.conferenceRoom ? this.conferenceRoom : this.room
    },
    localHandle () {
      return this.$store.getters['api/conference/localHandle']
    }
  },
  methods: {
    join (media) {
      this.joinDialog = false
      const config = this.$store.state.api.config.config
      const mediaPart = ['audio', 'video', 'data', 'screen'].filter(key => media[key] === true).join(',')
      const displayPart = this.user && this.user.username ? this.user.username : 'Anonymous'
      const display = `${displayPart}|${mediaPart}`
      const janusPayload = {
        janus: {
          roomid: this.selectedRoom.media.roomid,
          plugin: config.janusSettings.plugins.videoroom,
          display
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
          this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
          const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
          this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
        } catch (e) {
          console.log(e)
        }
      }
    },
    async toggleVideo () {
      try {
        if (!this.localHandle.video) {
          const media = {
            audio: this.localHandle.audio,
            video: !this.localHandle.video,
            screen: false
          }
          this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
          const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
          this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
        } else if (this.localHandle && this.localHandle.handle && this.localHandle.handle.isVideoMuted()) {
          this.localHandle.handle.unmuteVideo()
        } else {
          this.localHandle.handle.muteVideo()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async toggleAudio () {
      try {
        if (!this.localHandle.audio) {
          const media = {
            audio: !this.localHandle.audio,
            video: this.localHandle.video,
            screen: this.localHandle.screen
          }
          this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
          const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
          this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
        } else if (this.localHandle && this.localHandle.handle && this.localHandle.handle.isAudioMuted()) {
          this.localHandle.handle.unmuteAudio()
        } else {
          this.localHandle.handle.muteAudio()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async publish (media) {
      this.publishDialog = false
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
      const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
      this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
    },
    async unpublish () {
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media: { audio: false, video: false, screen: false, data: false } })
      await this.$store.dispatch('api/janus/videoroom/api/unpublish', { handleDto: this.localHandle })
    },
    leave () {
      this.$store.commit('panel/set', { panel: 'left', value: true }, { root: true })
      this.$store.dispatch('api/conference/leave')
    }
  }
}
</script>
