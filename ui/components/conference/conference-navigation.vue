<template>
  <v-layout justify-center dark>
    <join-dialog :room="room" :open="joinDialog" @join="join" @cancel="joinDialog = false" />
    <publish-dialog :room="room" :open="publishDialog" @publish="publish" @cancel="publishDialog = false" />
    <extension-dialog :open="extensionDialog" @cancel="extensionDialog = false" />

    <v-tooltip v-if="!localHandle" top left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="!localHandle"
          fab
          x-small
          color="green"
          :dark="!isDark"
          :light="isDark"
          v-on="on"
          @click="joinDialog = true"
        >
          <v-icon x-small>
            fa-phone-volume
          </v-icon>
        </v-btn>
      </template>
      <span>Join the conference</span>
    </v-tooltip>

    <v-tooltip v-if="room && room.media && !room.media.use_sip_bridge && localHandle && localHandle.stream" top left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle && localHandle.stream"
          fab
          x-small
          :dark="!isDark"
          :light="isDark"
          v-on="on"
          @click="unpublish()"
        >
          <v-icon x-small>
            fa-stop
          </v-icon>
        </v-btn>
      </template>
      <span>Unpublish</span>
    </v-tooltip>

    <v-menu
      v-if="localHandle"
      v-model="menus.screen"
      bottom
      offset-y
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip v-if="localHandle" top left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              v-if="localHandle"
              fab
              x-small
              :dark="!isDark"
              :light="isDark"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon v-if="!(localHandle.media.screen.enabled && !localHandle.media.screen.muted)">
                stop_screen_share
              </v-icon>
              <v-icon v-if="localHandle.media.screen.enabled && !localHandle.media.screen.muted">
                screen_share
              </v-icon>
            </v-btn>
          </template>
          <span>Screen-sharing options</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          @click="toggleScreenMuted()"
        >
          <v-list-item-title v-if="!localHandle.media.screen.muted">
            <v-icon x-small>
              fa-video-slash
            </v-icon> Pause Screen-sharing
          </v-list-item-title>
          <v-list-item-title v-if="localHandle.media.screen.muted">
            <v-icon x-small>
              fa-video
            </v-icon> Continue Screen-sharing
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.screen.enabled" />
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.bitrate.limit === 2 * 128000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 128000"
          @click="setBitrateLimit(128000)"
        >
          <v-list-item-title>
            128 kbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.bitrate.limit === 2 * 256000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 256000"
          @click="setBitrateLimit(256000)"
        >
          <v-list-item-title>
            256 kbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.bitrate.limit === 512000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 512000"
          @click="setBitrateLimit(512000)"
        >
          <v-list-item-title>
            512 kbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.bitrate.limit === 2 * 512000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 2 * 512000"
          @click="setBitrateLimit(2 * 512000)"
        >
          <v-list-item-title>
            1 Mbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.bitrate.limit === 4 * 512000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 4 * 512000"
          @click="setBitrateLimit(4 * 512000)"
        >
          <v-list-item-title>
            2 Mbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.bitrate.limit === 0 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 0"
          @click="setBitrateLimit(0)"
        >
          <v-list-item-title>
            No bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.screen.enabled" />
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.media.screen.resolution === 'lowres' ? 'red' : ''"
          :inactive="localHandle.media.screen.resolution === 'lowres'"
          @click="setVideoResolution('lowres')"
        >
          <v-list-item-title>
            Low resolution (320x240)
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.media.screen.resolution === 'stdres' ? 'red' : ''"
          :inactive="localHandle.media.screen.resolution === 'stdres'"
          @click="setVideoResolution('stdres')"
        >
          <v-list-item-title>
            Standard resolution (640x480)
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          :color="localHandle.media.screen.resolution === 'hires' ? 'red' : ''"
          :inactive="localHandle.media.screen.resolution === 'hires'"
          @click="setVideoResolution('hires')"
        >
          <v-list-item-title>
            High resolution (1280x720)
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.screen.enabled" />
        <v-list-item
          @click="toggleScreen()"
        >
          <v-list-item-title v-if="localHandle.media.screen.enabled">
            <v-icon x-small>
              fa-stop
            </v-icon> Disable Screen-sharing
          </v-list-item-title>
          <v-list-item-title v-if="!localHandle.media.screen.enabled">
            <v-icon x-small>
              fa-play
            </v-icon> Enable Screen-sharing
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

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
              fab
              x-small
              :dark="!isDark"
              :light="isDark"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon v-if="localHandle.media.video.enabled && !localHandle.media.video.muted">
                fa-video
              </v-icon>
              <v-icon v-if="!(localHandle.media.video.enabled && !localHandle.media.video.muted)">
                fa-video-slash
              </v-icon>
            </v-btn>
          </template>
          <span>Camera options</span>
        </v-tooltip>
      </template>
      <v-list dense multiple>
        <v-list-item
          v-if="localHandle.media.video.enabled"
          @click="toggleVideoMuted()"
        >
          <v-list-item-title v-if="!localHandle.media.video.muted">
            <v-icon x-small>
              fa-video-slash
            </v-icon> Turn camera off
          </v-list-item-title>
          <v-list-item-title v-if="localHandle.media.video.muted">
            <v-icon x-small>
              fa-video
            </v-icon> Turn camera on
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.video.enabled" />
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.bitrate.limit === 2 * 128000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 128000"
          @click="setBitrateLimit(128000)"
        >
          <v-list-item-title>
            128 kbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.bitrate.limit === 2 * 256000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 256000"
          @click="setBitrateLimit(256000)"
        >
          <v-list-item-title>
            256 kbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.bitrate.limit === 512000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 512000"
          @click="setBitrateLimit(512000)"
        >
          <v-list-item-title>
            512 kbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.bitrate.limit === 2 * 512000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 2 * 512000"
          @click="setBitrateLimit(2 * 512000)"
        >
          <v-list-item-title>
            1 Mbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.bitrate.limit === 4 * 512000 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 4 * 512000"
          @click="setBitrateLimit(4 * 512000)"
        >
          <v-list-item-title>
            2 Mbit bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.bitrate.limit === 0 ? 'red' : ''"
          :inactive="localHandle.bitrate.limit === 0"
          @click="setBitrateLimit(0)"
        >
          <v-list-item-title>
            No bitrate limit
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.video.enabled" />
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.media.video.resolution === 'lowres' ? 'red' : ''"
          :inactive="localHandle.media.video.resolution === 'lowres'"
          @click="setVideoResolution('lowres')"
        >
          <v-list-item-title>
            Low resolution (320x240)
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.media.video.resolution === 'stdres' ? 'red' : ''"
          :inactive="localHandle.media.video.resolution === 'stdres'"
          @click="setVideoResolution('stdres')"
        >
          <v-list-item-title>
            Standard resolution (640x480)
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="localHandle.media.video.enabled"
          :color="localHandle.media.video.resolution === 'hires' ? 'red' : ''"
          :inactive="localHandle.media.video.resolution === 'hires'"
          @click="setVideoResolution('hires')"
        >
          <v-list-item-title>
            High resolution (1280x720)
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.video.enabled" />
        <v-list-item
          @click="toggleVideo()"
        >
          <v-list-item-title v-if="localHandle.media.video.enabled">
            <v-icon x-small>
              fa-stop
            </v-icon> Disable camera
          </v-list-item-title>
          <v-list-item-title v-if="!localHandle.media.video.enabled">
            <v-icon x-small>
              fa-play
            </v-icon> Enable camera
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
              fab
              x-small
              :dark="!isDark"
              :light="isDark"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon v-if="localHandle.media.audio.enabled && !localHandle.media.audio.muted">
                fa-microphone
              </v-icon>
              <v-icon v-if="!(localHandle.media.audio.enabled && !localHandle.media.audio.muted)">
                fa-microphone-slash
              </v-icon>
            </v-btn>
          </template>
          <span>Microphone options</span>
        </v-tooltip>
      </template>
      <v-list dense>
        <v-list-item
          v-if="localHandle.media.audio.enabled"
          @click="toggleAudioMuted()"
        >
          <v-list-item-title v-if="!localHandle.media.audio.muted">
            <v-icon x-small>
              fa-microphone-slash
            </v-icon> Mute microphone
          </v-list-item-title>
          <v-list-item-title v-if="localHandle.media.audio.muted">
            <v-icon x-small>
              fa-microphone
            </v-icon> Unmute microphone
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="room && room.media && !room.media.use_sip_bridge"
          @click="toggleAudio()"
        >
          <v-list-item-title v-if="localHandle.media.audio.enabled">
            <v-icon x-small>
              fa-stop
            </v-icon> Disable microphone
          </v-list-item-title>
          <v-list-item-title v-if="!localHandle.media.audio.enabled">
            <v-icon x-small>
              fa-play
            </v-icon> Enable microphone
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-tooltip v-if="localHandle && !localHandle.stream" top left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle && !localHandle.stream"
          color="green"
          fab
          x-small
          :dark="!isDark"
          :light="isDark"
          v-on="on"
          @click="publishDialog = true"
        >
          <v-icon x-small>
            fa-bullhorn
          </v-icon>
        </v-btn>
      </template>
      <span>Publish</span>
    </v-tooltip>

    <v-tooltip v-if="conferenceSession" top left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="conferenceSession"
          color="red"
          fab
          x-small
          :dark="!isDark"
          :light="isDark"
          v-on="on"
          @click="leave()"
        >
          <v-icon x-small>
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
        screen: false,
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
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    join (media) {
      this.joinDialog = false
      this.$store.dispatch('api/conference/join', { user: this.user, room: this.selectedRoom, media })
    },
    async toggleScreen () {
      if (!this.$Janus.isExtensionEnabled()) {
        this.extensionDialog = true
      } else {
        await this.$store.dispatch('api/conference/toggleScreen')
      }
    },
    async toggleScreenMuted () {
      await this.$store.dispatch('api/conference/toggleScreenMuted')
    },
    async toggleVideo () {
      await this.$store.dispatch('api/conference/toggleVideo')
    },
    async toggleVideoMuted () {
      await this.$store.dispatch('api/conference/toggleVideoMuted')
    },
    async toggleAudio () {
      await this.$store.dispatch('api/conference/toggleAudio')
    },
    async toggleAudioMuted () {
      await this.$store.dispatch('api/conference/toggleAudioMuted')
    },
    async setVideoResolution (resolution) {
      await this.$store.dispatch('api/conference/setVideoResolution', resolution)
    },
    async setBitrateLimit (bitrateLimit) {
      await this.$store.dispatch('api/conference/setBitrateLimit', bitrateLimit)
    },
    async publish (media) {
      this.publishDialog = false
      await this.$store.dispatch('api/conference/publish', media)
    },
    async unpublish () {
      await this.$store.dispatch('api/conference/unpublish')
    },
    leave () {
      this.$store.commit('panel/set', { panel: 'left', value: true }, { root: true })
      this.$store.dispatch('api/conference/leave')
    }
  }
}
</script>

<style scoped>
.theme--dark.v-list-item:not(.v-list-item--link) {
    color: orange !important;
}
</style>
