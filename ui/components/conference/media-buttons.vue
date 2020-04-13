<template>
  <v-flex
    v-if="handle && conferencePosition === 'center'"
    class="d-flex align-content-start align-center justify-center"
  >
    <v-tooltip v-if="handle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          outlined
          dark
          x-small
          :color="handle.audio && !isAudioMuted(handle) ? 'green' : 'red'"
          style="bottom: 24px"
          v-on="on"
        >
          <v-icon v-if="handle.audio && !isAudioMuted(handle)" x-small>
            fa-microphone
          </v-icon>
          <v-icon v-if="!(handle.audio && !isAudioMuted(handle))" x-small>
            fa-microphone-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="handle.audio && !isAudioMuted(handle)">Microphone is on</span>
      <span v-if="!(handle.audio && !isAudioMuted(handle))">Microphone is off</span>
    </v-tooltip>

    <v-tooltip v-if="handle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          outlined
          dark
          x-small
          :color="handle.video && !isVideoMuted(handle) ? 'green' : 'red'"
          style="bottom: 24px"
          v-on="on"
        >
          <v-icon v-if="handle.video && !isVideoMuted(handle)" x-small>
            fa-video
          </v-icon>
          <v-icon v-if="!(handle.video && !isVideoMuted(handle))" x-small>
            fa-video-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="handle.video && !isVideoMuted(handle)">Camera is on</span>
      <span v-if="!(handle.video && !isVideoMuted(handle))">Camera is off</span>
    </v-tooltip>

    <v-tooltip v-if="handle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          outlined
          dark
          x-small
          :color="handle.screen ? 'green' : 'red'"
          style="bottom: 24px"
          v-on="on"
        >
          <v-icon v-if="handle.screen" x-small>
            screen_share
          </v-icon>
          <v-icon v-if="!(handle.screen)" x-small>
            stop_screen_share
          </v-icon>
        </v-btn>
      </template>
      <span v-if="handle.screen">Screenshare is on</span>
      <span v-if="!handle.screen">Screenshare is off</span>
    </v-tooltip>
    <v-tooltip v-if="handle && !handle.isLocal" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          outlined
          left
          dark
          small
          color="green"
          style="bottom: 24px"
          v-on="on"
        >
          {{ handle.currentBitrate }}
        </v-btn>
      </template>
      <span>Current bitrate</span>
    </v-tooltip>
  </v-flex>
</template>

<script>
export default {
  props: {
    handle: {
      type: Object,
      default: null
    },
    conferencePosition: {
      type: String,
      default: null
    }
  },
  methods: {
    isAudioMuted (handle) {
      const result = handle && handle.isAudioMuted
      console.log(`MEDIA BTNS: AUDIO='${result}'`)
      return result
    },
    isVideoMuted (handle) {
      const result = handle && handle.isVideoMuted
      console.log(`MEDIA BTNS: VIDEO='${result}'`)
      return result
    }
  }
}
</script>
