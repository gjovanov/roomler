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
          :color="handle.media.audio.enabled && !handle.media.audio.muted ? 'green' : 'red'"
          style="bottom: 24px"
          v-on="on"
        >
          <v-icon v-if="handle.media.audio.enabled && !handle.media.audio.muted" x-small>
            fa-microphone
          </v-icon>
          <v-icon v-if="!(handle.media.audio.enabled && !handle.media.audio.muted)" x-small>
            fa-microphone-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="handle.media.audio.enabled && !handle.media.audio.muted">Microphone is on</span>
      <span v-if="!(handle.media.audio.enabled && !handle.media.audio.muted)">Microphone is off</span>
    </v-tooltip>

    <v-tooltip v-if="handle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          outlined
          dark
          x-small
          :color="handle.media.video.enabled && !handle.media.video.muted ? 'green' : 'red'"
          style="bottom: 24px"
          v-on="on"
        >
          <v-icon v-if="handle.media.video.enabled && !handle.media.video.muted" x-small>
            fa-video
          </v-icon>
          <v-icon v-if="!(handle.media.video.enabled && !handle.media.video.muted)" x-small>
            fa-video-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="handle.media.video.enabled && !handle.media.video.muted">Camera is on</span>
      <span v-if="!(handle.media.video.enabled && !handle.media.video.muted)">Camera is off</span>
    </v-tooltip>

    <v-tooltip v-if="handle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          outlined
          dark
          x-small
          :color="handle.media.screen.enabled ? 'green' : 'red'"
          style="bottom: 24px"
          v-on="on"
        >
          <v-icon v-if="handle.media.screen.enabled" x-small>
            screen_share
          </v-icon>
          <v-icon v-if="!(handle.media.screen.enabled)" x-small>
            stop_screen_share
          </v-icon>
        </v-btn>
      </template>
      <span v-if="handle.media.screen.enabled">Screenshare is on</span>
      <span v-if="!handle.media.screen.enabled">Screenshare is off</span>
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
          {{ handle.bitrate.value }}
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
  }
}
</script>
