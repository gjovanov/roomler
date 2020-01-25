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
                :text="!media.video"
                v-on="on"
                @click="media.video = !media.video"
                outlined
              >
                <v-icon v-if="media.video">
                  fa-video
                </v-icon>
                <v-icon v-if="!media.video">
                  fa-video-slash
                </v-icon>
              </v-btn>
            </template>
            <span v-if="media.video">Camera video</span>
            <span v-if="!media.video">No camera video</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="!media.screen"
                v-on="on"
                @click="media.screen = !media.screen"
                outlined
              >
                <v-icon v-if="media.screen">
                  screen_share
                </v-icon>
                <v-icon v-if="!media.screen">
                  stop_screen_share
                </v-icon>
              </v-btn>
            </template>
            <span v-if="media.screen">Screen share</span>
            <span v-if="!media.screen">No screen share</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="!media.audio"
                v-on="on"
                @click="media.audio = !media.audio"
                outlined
              >
                <v-icon v-if="media.audio">
                  fa-microphone
                </v-icon>
                <v-icon v-if="!media.audio">
                  fa-microphone-slash
                </v-icon>
              </v-btn>
            </template>
            <span v-if="media.audio">Microphone audio</span>
            <span v-if="!media.audio">No microphone audio</span>
          </v-tooltip>
        </v-layout>
      </v-card-text>
      <v-spacer />

      <v-card-actions>
        <v-spacer />

        <v-btn
          @click="cancel()"
          color="green darken-1"
          outlined
        >
          Cancel
        </v-btn>

        <v-btn
          @click="join()"
          color="green darken-1"
          outlined
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
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false,
      media: {
        audio: true,
        video: true,
        screen: false
      }
    }
  },
  watch: {
    open (newVal) {
      this.dialog = newVal
    },
    'media.video' (newVal) {
      if (newVal) {
        this.media.screen = false
      }
    },
    'media.screen' (newVal) {
      if (newVal) {
        this.media.video = false
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
