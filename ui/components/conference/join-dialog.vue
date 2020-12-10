<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">
        {{ $t('comps.conference.joinConference') }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row v-if="!isValid">
            <v-col cols="12">
              <h2 class="red">
                {{ $t('comps.conference.webrtNotSupported') }}
              </h2>
            </v-col>
          </v-row>
          <v-row v-if="isValid">
            <v-col cols="12">
              <h4>{{ $t('comps.conference.selectMedia') }}</h4>
              <video
                v-if="stream"
                id="join-video"
                :srcObject.prop="stream"
                width="100%"
                height="100%"
                style="max-height: 240px"
                autoplay
                playsinline
                muted
              />

              <v-flex class="d-flex align-content-start align-center justify-center">
                <v-tooltip top>
                  <template #activator="{ on }">
                    <v-btn
                      fab
                      small
                      :dark="!isDark && !media.video.enabled"
                      :light="isDark && !media.video.enabled"
                      :style="stream? 'bottom: 24px' : ''"
                      v-on="on"
                      @click="media.video.enabled = !media.video.enabled"
                    >
                      <v-icon v-if="media.video.enabled">
                        fa-video
                      </v-icon>
                      <v-icon v-if="!media.video.enabled">
                        fa-video-slash
                      </v-icon>
                    </v-btn>
                  </template>
                  <span v-if="media.video.enabled">
                    {{ $t('comps.conference.cameraOn') }}
                  </span>
                  <span v-if="!media.video.enabled">
                    {{ $t('comps.conference.cameraOff') }}
                  </span>
                </v-tooltip>
                <v-tooltip top>
                  <template #activator="{ on }">
                    <v-btn
                      fab
                      small
                      :dark="!isDark && !media.audio.enabled"
                      :light="isDark && !media.audio.enabled"
                      :disabled="disableAudioChange"
                      :style="stream? 'bottom: 24px' : ''"
                      v-on="on"
                      @click="media.audio.enabled = !media.audio.enabled"
                    >
                      <v-icon v-if="media.audio.enabled">
                        fa-microphone
                      </v-icon>
                      <v-icon v-if="!media.audio.enabled">
                        fa-microphone-slash
                      </v-icon>
                    </v-btn>
                  </template>
                  <span v-if="media.audio.enabled">
                    {{ $t('comps.conference.microphoneOn') }}
                  </span>
                  <span v-if="!media.audio.enabled">
                    {{ $t('comps.conference.microphoneOff') }}
                  </span>
                </v-tooltip>
                <v-tooltip top>
                  <template #activator="{ on }">
                    <v-btn
                      fab
                      small
                      :dark="!isDark && !settings"
                      :light="isDark && !settings"
                      :style="stream? 'bottom: 24px' : ''"
                      v-on="on"
                      @click="settings = !settings"
                    >
                      <v-icon v-if="settings">
                        fa-times
                      </v-icon>
                      <v-icon v-if="!settings">
                        fa-cog
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>
                    {{ $t('comps.conference.mediaSettings') }}
                  </span>
                </v-tooltip>
              </v-flex>
              <ul>
                <li v-if="media.screen.enabled">
                  <strong v-if="media.screen.enabled">
                    {{ $t('comps.conference.screenOn') }}:
                  </strong>
                  <span v-if="media.screen.enabled">
                    {{ $t('comps.conference.screenSelectedAfterJoining') }}
                  </span>
                </li>
              </ul>
            </v-col>
          </v-row>
          <v-row v-if="isValid && settings && media.audio.enabled">
            <v-col cols="12">
              <v-select
                v-model="media.audio.device"
                :items="audioDevices"
                item-text="label"
                item-value="deviceId"
                :label="$t('comps.conference.microphoneDevice')"
                :hint="$t('comps.conference.microphoneDevice')"
                persistent-hint
                single-line
                dense
                @change="changeStream()"
              />
              <v-progress-linear :value="microphoneLevel" />
            </v-col>
          </v-row>
          <v-row v-if="isValid && settings && media.video.enabled">
            <v-col cols="12">
              <v-select
                v-model="media.video.device"
                :items="videoDevices"
                item-text="label"
                item-value="deviceId"
                :label="$t('comps.conference.cameraDevice')"
                :hint="$t('comps.conference.cameraDevice')"
                persistent-hint
                single-line
                dense
                @change="changeStream()"
              />
            </v-col>
          </v-row>
          <v-row v-if="isValid && settings && sinkIdEnabled">
            <v-col cols="12">
              <v-select
                v-model="media.speakers.device"
                :items="speakers"
                item-text="label"
                item-value="deviceId"
                :label="$t('comps.conference.speakers')"
                :hint="$t('comps.conference.speakers')"
                persistent-hint
                single-line
                dense
                hide-details
                append-outer-icon="fa-play"
                @click:append-outer="playSound()"
              />
              <audio
                id="join-audio-sound"
                src="/audio/sunny.mp3"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-spacer />

      <v-card-actions>
        <v-btn
          color="grey"
          outlined
          @click="cancel()"
        >
          {{ $t('comps.conference.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          outlined
          :disabled="!isValid || !stream"
          @click="join()"
        >
          {{ $t('comps.conference.join') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import AudioLevelWatcher from '@/utils/audio-utils'

export default {
  props: {
    room: {
      type: Object,
      default: null
    },
    audioDevices: {
      type: Array,
      default () {
        return []
      }
    },
    speakers: {
      type: Array,
      default () {
        return []
      }
    },
    videoDevices: {
      type: Array,
      default () {
        return []
      }
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false,
      disableAudioChange: false,
      isWebrtcSupported: null,
      isGetUserMediaAvailable: null,
      isGetDisplayMediaAvailable: null,
      microphoneLevel: null,
      audioWatcher: null,
      sinkIdEnabled: true,

      stream: null,
      streamTimeout: null,
      streamInterval: 50,
      settings: false,
      selected: {
        audio: false,
        video: false
      },

      media: {
        speakers: {
          device: null
        },
        audio: {
          enabled: true,
          codec: this.room && this.room.media ? this.room.media.audiocodec : null,
          device: null
        },
        video: {
          enabled: true,
          codec: this.room && this.room.media ? this.room.media.videocodec : null,
          device: null
        },
        screen: {
          enabled: false
        }
      }
    }
  },
  computed: {
    isValid () {
      return this.isWebrtcSupported && this.isGetUserMediaAvailable
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  watch: {
    open (newVal) {
      this.dialog = newVal
      if (this.dialog) {
        this.media.audio.enabled = true
        this.media.video.enabled = true
        this.media.screen.enabled = false
        this.settings = false

        this.isWebrtcSupported = this.$Janus.isWebrtcSupported()
        this.isGetUserMediaAvailable = this.$Janus.isGetUserMediaAvailable()
        this.isGetDisplayMediaAvailable = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
        this.sinkIdEnabled = ('sinkId' in HTMLMediaElement.prototype)
        this.selectAudioDevices()
        this.selectVideoDevices()
        if (this.room && this.room.media && this.room.media.use_sip_bridge) {
          this.media.audio.enabled = true
          this.disableAudioChange = true
        } else {
          this.disableAudioChange = false
        }
        this.getStream()
      } else {
        this.closeStream()
      }
    },
    'media.audio.enabled' (newVal) {
      if (this.stream && this.stream.getAudioTracks().length) {
        this.stream.getAudioTracks()[0].enabled = newVal
      }
    },
    'media.video.enabled' (newVal) {
      if (newVal) {
        this.media.screen.enabled = false
      }
      if (this.stream && this.stream.getVideoTracks().length) {
        this.stream.getVideoTracks()[0].enabled = newVal
      }
    },
    'media.screen.enabled' (newVal) {
      if (newVal) {
        this.media.video.enabled = false
      }
    },
    'media.speakers.device' (newVal) {
      const video = document.getElementById('join-video')
      if (video) {
        video.setSinkId(newVal)
      }
    },
    audioDevices () {
      this.selectAudioDevices()
    },
    speakers () {
      this.selectSpeakerDevices()
    },
    videoDevices () {
      this.selectVideoDevices()
    }
  },
  methods: {
    selectAudioDevices () {
      // if no default device found, select the first one in the list
      const defaultAudioDevice = this.audioDevices.find(d => d.label === 'default')
      if (defaultAudioDevice) {
        this.media.audio.device = defaultAudioDevice.deviceId
      }
      if (!defaultAudioDevice && this.audioDevices.length) {
        this.media.audio.device = this.audioDevices[0].deviceId
      }
      this.selected.audio = true
    },
    selectSpeakerDevices () {
      // if no default device found, select the first one in the list
      const defaultSpeaker = this.speakers.find(d => d.label === 'default')
      if (defaultSpeaker) {
        this.media.speakers.device = defaultSpeaker.deviceId
      }

      if (!defaultSpeaker && this.speakers.length) {
        this.media.speakers.device = this.speakers[0].deviceId
      }
    },
    selectVideoDevices () {
      // if no default device found, select the first one in the list
      const defaultVideoDevice = this.videoDevices.find(d => d.label === 'default')
      if (defaultVideoDevice) {
        this.media.video.device = defaultVideoDevice.deviceId
      }
      if (!defaultVideoDevice && this.videoDevices.length) {
        this.media.video.device = this.videoDevices[0].deviceId
      }
      this.selected.video = true
    },
    async getStream () {
      const self = this
      if (this.selected.audio && this.selected.video) {
        try {
          self.closeStream()
          self.stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: self.media.video.device }, audio: { deviceId: self.media.audio.device } })
        } catch (err) {
          self.closeStream()
          if (err.name && err.name.includes('NotAllowedError')) {
            alert(self.$t('comps.conference.accessNotAllowed'))
          } else if (err && err.name && (err.name.includes('AbortError') || err.name.includes('NotReadableError'))) {
            alert(self.$t('comps.conference.deviceError'))
          } else {
            alert(err || 'Unexpected Error')
          }
          self.$emit('cancel')
          return
        }
        try {
          if (self.audioWatcher) {
            self.audioWatcher.close()
          }
          if (self.stream) {
            self.audioWatcher = new AudioLevelWatcher(self.stream, (v) => {
              self.microphoneLevel = v
            })
          }
        } catch (err) {
        /* handle the error */
        }
      }
    },
    closeStream () {
      if (this.audioWatcher) {
        this.audioWatcher.close()
        this.audioWatcher = null
      }
      if (this.stream) {
        this.$Janus.stopAllTracks(this.stream)
        this.stream = null
      }
    },
    changeStream () {
      this.closeStream()
      this.getStream()
    },
    join () {
      this.closeStream()
      this.$emit('join', this.media)
    },
    cancel () {
      this.$emit('cancel')
    },
    async playSound () {
      const audio = document.getElementById('join-audio-sound')
      if (audio) {
        try {
          await audio.setSinkId(this.media.speakers.device)
          await audio.pause()
          audio.currentTime = 0
          await audio.play()
        } catch (e) {
          this.$consola.info(e)
        }
      }
    }
  }
}
</script>
