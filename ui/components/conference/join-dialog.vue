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
          <v-btn
            outlined
            :text="!media.sendVideo"
            @click="media.sendVideo = !media.sendVideo"
          >
            <v-icon v-if="media.sendVideo">
              fa-video
            </v-icon>
            <v-icon v-if="!media.sendVideo">
              fa-video-slash
            </v-icon>
          </v-btn>
          <v-btn
            outlined
            :text="!media.sendAudio"
            @click="media.sendAudio = !media.sendAudio"
          >
            <v-icon v-if="media.sendAudio">
              fa-microphone
            </v-icon>
            <v-icon v-if="!media.sendAudio">
              fa-microphone-slash
            </v-icon>
          </v-btn>
        </v-layout>
      </v-card-text>
      <v-spacer />

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green darken-1"
          outlined
          @click="cancel()"
        >
          Cancel
        </v-btn>

        <v-btn
          color="green darken-1"
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
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false,
      media: {
        sendAudio: true,
        sendVideo: true
      }
    }
  },
  watch: {
    open (newVal) {
      this.dialog = newVal
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
