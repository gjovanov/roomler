<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        Join the conference
      </v-card-title>
      <v-card-text>
        Select your media.
        <v-spacer />
        <v-layout justify-center>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="!media.video.enabled"
                outlined
                tile
                small
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
            <span v-if="media.video.enabled">Camera video</span>
            <span v-if="!media.video.enabled">No camera video</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="!media.screen.enabled"
                outlined
                tile
                small
                v-on="on"
                @click="media.screen.enabled = !media.screen.enabled"
              >
                <v-icon v-if="media.screen.enabled">
                  screen_share
                </v-icon>
                <v-icon v-if="!media.screen.enabled">
                  stop_screen_share
                </v-icon>
              </v-btn>
            </template>
            <span v-if="media.screen.enabled">Screen share</span>
            <span v-if="!media.screen.enabled">No screen share</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="!media.audio.enabled"
                outlined
                tile
                small
                :disabled="disableAudioChange"
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
            <span v-if="media.audio.enabled">Microphone audio</span>
            <span v-if="!media.audio.enabled">No microphone audio</span>
          </v-tooltip>
        </v-layout>
      </v-card-text>
      <v-spacer />

      <v-card-actions>
        <v-btn
          color="grey"
          outlined
          @click="cancel()"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          outlined
          @click="join()"
        >
          Join
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    room: {
      type: Object,
      default: null
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
      media: {
        audio: {
          enabled: true,
          codec: this.room && this.room.media ? this.room.media.audiocodec : null
        },
        video: {
          enabled: true,
          codec: this.room && this.room.media ? this.room.media.videocodec : null
        },
        screen: {
          enabled: false
        }
      }
    }
  },
  watch: {
    open (newVal) {
      this.dialog = newVal
      if (this.dialog) {
        if (this.room && this.room.media && this.room.media.use_sip_bridge) {
          this.media.audio.enabled = true
          this.disableAudioChange = true
        } else {
          this.disableAudioChange = false
        }
      }
    },
    'media.video.enabled' (newVal) {
      if (newVal) {
        this.media.screen.enabled = false
      }
    },
    'media.screen.enabled' (newVal) {
      if (newVal) {
        this.media.video.enabled = false
      }
    }
  },
  methods: {
    join () {
      this.$emit('join', this.media)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
