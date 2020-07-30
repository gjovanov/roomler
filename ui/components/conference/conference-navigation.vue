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

    <v-tooltip v-if="localHandle && localHandle.stream" top left>
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

    <v-tooltip v-if="localHandle" top left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle"
          fab
          x-small
          :dark="!isDark"
          :light="isDark"
          v-on="on"
          @click="toggleScreen()"
        >
          <v-icon v-if="!localHandle.media.screen.enabled">
            screen_share
          </v-icon>
          <v-icon v-if="localHandle.media.screen.enabled">
            stop_screen_share
          </v-icon>
        </v-btn>
      </template>
      <span v-if="localHandle.media.screen.enabled">Stop sharing screen</span>
      <span v-if="!localHandle.media.screen.enabled">Start sharing screen</span>
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
          <span>Change video</span>
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
        <v-divider />
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
        <v-divider />
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
        <v-divider />
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
          <span>Change audio</span>
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

import { modelToQuery } from '@/services/handle-dto'
import { v4 as uuid } from 'uuid'

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
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    join (media) {
      this.joinDialog = false
      const config = this.$store.state.api.config.config
      const mediaPart = modelToQuery(media)
      const displayPart = this.user && this.user.username ? this.user.username : 'Anonymous'
      const display = `${displayPart}?${mediaPart}`
      const janusPayload = {
        janus: {
          roomid: this.selectedRoom.media.roomid,
          room: {
            _id: this.selectedRoom._id
          },
          call_id: uuid(),
          isLocal: true,
          plugin: config.janusSettings.plugins.videoroom,
          display,
          bitrateLimit: this.selectedRoom.media.bitrate
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
            video: {
              enabled: false
            },
            screen: {
              enabled: !this.localHandle.media.screen.enabled
            }
          }
          this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
          const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
          this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
        } catch (e) {
          this.$consola.error(e)
        }
      }
    },
    async toggleVideo () {
      try {
        const media = {
          video: {
            enabled: !this.localHandle.media.video.enabled
          },
          screen: {
            enabled: false
          }
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
        const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
        this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
      } catch (e) {
        this.$consola.error(e)
      }
    },
    async toggleVideoMuted () {
      try {
        const media = {
          video: {
            muted: !this.localHandle.media.video.muted
          }
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
        await this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle })
        if (this.localHandle && this.localHandle.handle && !this.localHandle.media.video.muted) {
          this.localHandle.handle.unmuteVideo()
        } else {
          this.localHandle.handle.muteVideo()
        }
      } catch (e) {
        this.$consola.error(e)
      }
    },
    async toggleAudio () {
      try {
        const media = {
          audio: {
            enabled: !this.localHandle.media.audio.enabled
          }
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
        const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
        this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
      } catch (e) {
        this.$consola.error(e)
      }
    },
    async toggleAudioMuted () {
      try {
        const media = {
          audio: {
            muted: !this.localHandle.media.audio.muted
          }
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
        await this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle })
        if (this.localHandle && this.localHandle.handle && !this.localHandle.media.audio.muted) {
          this.localHandle.handle.unmuteAudio()
        } else {
          this.localHandle.handle.muteAudio()
        }
      } catch (e) {
        this.$consola.error(e)
      }
    },
    async setVideoResolution (resolution) {
      try {
        const media = {
          video: {
            resolution
          }
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
        const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
        this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
      } catch (e) {
        this.$consola.error(e)
      }
    },
    async setBitrateLimit (bitrateLimit) {
      try {
        this.$store.commit('api/janus/videoroom/updates/setBitrateLimit', { handleDto: this.localHandle, bitrateLimit })
        await this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle })
      } catch (e) {
        this.$consola.error(e)
      }
    },
    async publish (media) {
      this.publishDialog = false
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
      const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDto: this.localHandle })
      this.$store.dispatch('api/janus/videoroom/api/configure', { handleDto: this.localHandle, jsep })
    },
    async unpublish () {
      const media = {
        audio: {
          enabled: false
        },
        video: {
          enabled: false
        },
        screen: {
          enabled: false
        },
        data: {
          enabled: false
        }
      }
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDto: this.localHandle, media })
      await this.$store.dispatch('api/janus/videoroom/api/unpublish', { handleDto: this.localHandle })
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
