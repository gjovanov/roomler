<template>
  <v-layout justify-center dark>
    <join-dialog
      :room="room"
      :audio-devices="audioDevices"
      :speakers="speakers"
      :video-devices="videoDevices"
      :open="joinDialog"
      @join="join"
      @cancel="joinDialog = false"
    />
    <publish-dialog
      :room="room"
      :audio-devices="audioDevices"
      :speakers="speakers"
      :video-devices="videoDevices"
      :open="publishDialog"
      @publish="publish"
      @cancel="publishDialog = false"
    />
    <extension-dialog
      :open="extensionDialog"
      @cancel="extensionDialog = false"
    />

    <v-tooltip v-if="!localHandle" top left>
      <template #activator="{ on }">
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
      <span>{{ $t('comps.conference.joinConference') }}</span>
    </v-tooltip>

    <v-tooltip v-if="room && room.media && !room.media.use_sip_bridge && localHandle && localHandle.stream" top left>
      <template #activator="{ on }">
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
      <span>{{ $t('comps.conference.unpublish') }}</span>
    </v-tooltip>

    <v-menu
      v-if="localHandle"
      v-model="menus.screen"
      bottom
      offset-y
      open-on-hover
      close-on-click
    >
      <template #activator="{ on: menu }">
        <v-tooltip v-if="localHandle" top left>
          <template #activator="{ on: tooltip }">
            <v-btn
              v-if="localHandle"
              fab
              x-small
              :dark="!isDark"
              :light="isDark"
              v-on="{ ...tooltip, ...menu }"
              @click="clickScreen()"
            >
              <v-icon v-if="!(localHandle.media.screen.enabled && !localHandle.media.screen.muted)">
                stop_screen_share
              </v-icon>
              <v-icon v-if="localHandle.media.screen.enabled && !localHandle.media.screen.muted">
                screen_share
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('comps.conference.screenOptions') }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item
          v-if="localHandle.media.screen.enabled"
          @click="toggleScreenMuted()"
        >
          <v-list-item-title v-if="!localHandle.media.screen.muted">
            <v-icon small>
              stop_screen_share
            </v-icon> {{ $t('comps.conference.screenPause') }}
          </v-list-item-title>
          <v-list-item-title v-if="localHandle.media.screen.muted">
            <v-icon small>
              screen_share
            </v-icon> {{ $t('comps.conference.screenPlay') }}
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.screen.enabled" />
        <v-list-item
          @click="toggleScreen()"
        >
          <v-list-item-title v-if="localHandle.media.screen.enabled">
            <v-icon x-small>
              fa-stop
            </v-icon> {{ $t('comps.conference.screenDisable') }}
          </v-list-item-title>
          <v-list-item-title v-if="!localHandle.media.screen.enabled">
            <v-icon x-small>
              fa-play
            </v-icon> {{ $t('comps.conference.screenEnable') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      v-if="localHandle"
      v-model="menus.video"
      bottom
      offset-y
      open-on-hover
      close-on-click
    >
      <template #activator="{ on: menu }">
        <v-tooltip v-if="localHandle" top left>
          <template #activator="{ on: tooltip }">
            <v-btn
              v-if="localHandle"
              fab
              x-small
              :dark="!isDark"
              :light="isDark"
              v-on="{ ...tooltip, ...menu }"
              @click="clickVideo()"
            >
              <v-icon v-if="localHandle.media.video.enabled && !localHandle.media.video.muted">
                fa-video
              </v-icon>
              <v-icon v-if="!(localHandle.media.video.enabled && !localHandle.media.video.muted)">
                fa-video-slash
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('comps.conference.cameraOptions') }}</span>
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
            </v-icon> {{ $t('comps.conference.cameraPause') }}
          </v-list-item-title>
          <v-list-item-title v-if="localHandle.media.video.muted">
            <v-icon x-small>
              fa-video
            </v-icon> {{ $t('comps.conference.cameraPlay') }}
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.video.enabled" />
        <v-subheader
          v-if="localHandle.media.video.enabled"
          class="ml-1"
        >
          {{ $t('comps.conference.cameraDevice') }}
        </v-subheader>
        <template
          v-if="localHandle.media.video.enabled"
        >
          <v-list-item
            v-for="(device) in videoDevices"

            :key="device.deviceId"
            :inactive="localHandle.media.video.device === device.deviceId"
            :disabled="localHandle.media.video.device === device.deviceId"
            @click="setVideoDevice(device)"
          >
            <v-list-item-title>
              {{ device.label }}
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-divider v-if="localHandle.media.video.enabled" />
        <v-list-item
          @click="toggleVideo()"
        >
          <v-list-item-title v-if="localHandle.media.video.enabled">
            <v-icon x-small>
              fa-stop
            </v-icon> {{ $t('comps.conference.cameraDisable') }}
          </v-list-item-title>
          <v-list-item-title v-if="!localHandle.media.video.enabled">
            <v-icon x-small>
              fa-play
            </v-icon> {{ $t('comps.conference.cameraEnable') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      v-if="localHandle"
      v-model="menus.audio"
      bottom
      offset-y
      open-on-hover
      close-on-click
    >
      <template #activator="{ on: menu }">
        <v-tooltip v-if="localHandle" top left>
          <template #activator="{ on: tooltip }">
            <v-btn
              v-if="localHandle"
              fab
              x-small
              :dark="!isDark"
              :light="isDark"
              v-on="{ ...tooltip, ...menu }"
              @click="clickAudio()"
            >
              <v-icon v-if="localHandle.media.audio.enabled && !localHandle.media.audio.muted">
                fa-microphone
              </v-icon>
              <v-icon v-if="!(localHandle.media.audio.enabled && !localHandle.media.audio.muted)">
                fa-microphone-slash
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('comps.conference.microphoneOptions') }}</span>
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
            </v-icon> {{ $t('comps.conference.microphonePause') }}
          </v-list-item-title>
          <v-list-item-title v-if="localHandle.media.audio.muted">
            <v-icon x-small>
              fa-microphone
            </v-icon> {{ $t('comps.conference.microphonePlay') }}
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.audio.enabled" />
        <v-subheader v-if="localHandle.media.audio.enabled">
          {{ $t('comps.conference.microphoneDevice') }}
        </v-subheader>
        <template
          v-if="localHandle.media.audio.enabled"
        >
          <v-list-item
            v-for="(device) in audioDevices"
            :key="device.deviceId"
            :inactive="localHandle.media.audio.device === device.deviceId"
            :disabled="localHandle.media.audio.device === device.deviceId"
            @click="setAudioDevice(device)"
          >
            <v-list-item-title>
              {{ device.label }}
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-divider v-if="localHandle.media.audio.enabled && sinkIdEnabled" />
        <v-subheader v-if="localHandle.media.audio.enabled && sinkIdEnabled">
          {{ $t('comps.conference.speakers') }}
        </v-subheader>
        <template
          v-if="localHandle.media.audio.enabled && sinkIdEnabled"
        >
          <v-list-item
            v-for="(device) in speakers"
            :key="`${device.deviceId}-speaker`"
            :inactive="localHandle.media.speakers.device === device.deviceId"
            :disabled="localHandle.media.speakers.device === device.deviceId"
            @click="setSpeakerDevice(device)"
          >
            <v-list-item-title>
              {{ device.label }}
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-divider v-if="localHandle.media.audio.enabled" />
        <v-list-item
          v-if="room && room.media && !room.media.use_sip_bridge"
          @click="toggleAudio()"
        >
          <v-list-item-title v-if="localHandle.media.audio.enabled">
            <v-icon x-small>
              fa-stop
            </v-icon> {{ $t('comps.conference.microphoneDisable') }}
          </v-list-item-title>
          <v-list-item-title v-if="!localHandle.media.audio.enabled">
            <v-icon x-small>
              fa-play
            </v-icon> {{ $t('comps.conference.microphoneEnable') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-tooltip v-if="localHandle && !localHandle.stream" top left>
      <template #activator="{ on }">
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
      <span>{{ $t('comps.conference.publish') }}</span>
    </v-tooltip>

    <v-tooltip v-if="conferenceSession" top left>
      <template #activator="{ on }">
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
      <span>{{ $t('comps.conference.hangUp') }}</span>
    </v-tooltip>

    <v-menu
      v-if="localHandle && localHandle.stream && (localHandle.media.video.enabled || localHandle.media.screen.enabled)"
      v-model="menus.settings"
      bottom
      offset-y
      open-on-hover
      close-on-click
      right
    >
      <template #activator="{ on: menu }">
        <v-tooltip v-if="localHandle" top left>
          <template #activator="{ on: tooltip }">
            <v-btn
              v-if="localHandle && localHandle.stream && (localHandle.media.video.enabled || localHandle.media.screen.enabled)"
              fab
              x-small
              :dark="!isDark"
              :light="isDark"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon>
                fa-ellipsis-v
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('comps.conference.settings') }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-subheader
          v-if="localHandle.media.video.enabled || localHandle.media.screen.enabled"
          class="ml-1"
        >
          {{ $t('comps.conference.selectBitrate') }}
        </v-subheader>
        <v-list-item
          :color="localHandle.bitrate.limit === 2 * 128000 ? 'primary' : ''"
          :inactive="localHandle.bitrate.limit === 128000"
          @click="setBitrateLimit(128000)"
        >
          <v-list-item-title>
            {{ $t('comps.conference.bitrate128k') }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :color="localHandle.bitrate.limit === 2 * 256000 ? 'primary' : ''"
          :inactive="localHandle.bitrate.limit === 256000"
          @click="setBitrateLimit(256000)"
        >
          <v-list-item-title>
            {{ $t('comps.conference.bitrate256k') }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :color="localHandle.bitrate.limit === 512000 ? 'primary' : ''"
          :inactive="localHandle.bitrate.limit === 512000"
          @click="setBitrateLimit(512000)"
        >
          <v-list-item-title>
            {{ $t('comps.conference.bitrate512k') }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :color="localHandle.bitrate.limit === 2 * 512000 ? 'primary' : ''"
          :inactive="localHandle.bitrate.limit === 2 * 512000"
          @click="setBitrateLimit(2 * 512000)"
        >
          <v-list-item-title>
            {{ $t('comps.conference.bitrate1M') }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :color="localHandle.bitrate.limit === 4 * 512000 ? 'primary' : ''"
          :inactive="localHandle.bitrate.limit === 4 * 512000"
          @click="setBitrateLimit(4 * 512000)"
        >
          <v-list-item-title>
            {{ $t('comps.conference.bitrate2M') }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :color="localHandle.bitrate.limit === 0 ? 'primary' : ''"
          :inactive="localHandle.bitrate.limit === 0"
          @click="setBitrateLimit(0)"
        >
          <v-list-item-title>
            {{ $t('comps.conference.bitrateNoLimit') }}
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="localHandle.media.video.enabled" />
        <v-subheader
          v-if="localHandle.media.video.enabled"
          class="ml-1"
        >
          {{ $t('comps.conference.selectResolution') }}
        </v-subheader>
        <template
          v-if="localHandle.media.video.enabled"
        >
          <v-list-item
            v-for="resolution in resolutions"
            :key="resolution.id"
            :inactive="localHandle.media.video.resolution === resolution.label"
            @click="setVideoResolution(resolution.label)"
          >
            <v-list-item-title>
              {{ resolution.label }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
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
      sinkIdEnabled: false,
      menus: {
        unpublish: false,
        screen: false,
        video: false,
        audio: false,
        settings: false
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
    audioDevices () {
      return this.$store.state.api.conference.audioDevices
    },
    speakers () {
      return this.$store.state.api.conference.speakers
    },
    videoDevices () {
      return this.$store.state.api.conference.videoDevices
    },
    resolutions () {
      return this.$store.state.api.conference.resolutions // .filter(r => r.devices.includes(this.localHandle.media.video.device))
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  watch: {
    async joinDialog (newVal) {
      if (newVal && (!this.audioDevices.length || !this.videoDevices.length)) {
        this.sinkIdEnabled = ('sinkId' in HTMLMediaElement.prototype)
        await this.$store.dispatch('api/janus/session/init', true, { root: true })
        await this.$store.dispatch('api/conference/listDevices', null, { root: true })
        // await this.$store.dispatch('api/conference/getResolutionsPerDevice', null, { root: true })
      }
    }
  },
  methods: {
    join (media) {
      this.joinDialog = false
      try {
        this.$store.dispatch('api/conference/join', { user: this.user, room: this.selectedRoom, media })
      } catch (err) {
        alert(err)
      }
    },
    async clickScreen () {
      if (this.localHandle && this.localHandle.media.screen.enabled) {
        await this.toggleScreenMuted()
      } else {
        await this.toggleScreen()
      }
    },
    async clickAudio () {
      if (this.localHandle && this.localHandle.media.audio.enabled) {
        await this.toggleAudioMuted()
      } else {
        await this.toggleAudio()
      }
    },
    async clickVideo () {
      if (this.localHandle && this.localHandle.media.video.enabled) {
        await this.toggleVideoMuted()
      } else {
        await this.toggleVideo()
      }
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
      await this.$store.dispatch('api/conference/setVideoResolution', { resolution })
    },
    async setBitrateLimit (bitrateLimit) {
      await this.$store.dispatch('api/conference/setBitrateLimit', bitrateLimit)
    },
    async setVideoDevice (device) {
      await this.$store.dispatch('api/conference/setVideo', device.deviceId)
    },
    async setAudioDevice (device) {
      await this.$store.dispatch('api/conference/setAudio', device.deviceId)
    },
    async setSpeakerDevice (device) {
      await this.$store.dispatch('api/conference/setSpeaker', device.deviceId)
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
.theme--light.v-list-item:not(.v-list-item--link) {
    color: orange !important;
}
</style>
