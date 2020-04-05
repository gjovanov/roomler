<template>
  <div
    v-if="handle"
  >
    <v-tooltip v-if="handle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          absolute
          left
          bottom
          outlined
          dark
          x-small
          style="bottom: -8px"
          v-on="on"
        >
          <v-icon v-if="handle.audio" x-small>
            fa-microphone
          </v-icon>
          <v-icon v-if="!(handle.audio)" x-small>
            fa-microphone-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="handle.audio">Microphone is on</span>
      <span v-if="!handle.audio">Microphone is off</span>
    </v-tooltip>

    <v-tooltip v-if="handle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          absolute
          left
          bottom
          outlined
          dark
          x-small
          style="margin-left: 48px !important; bottom: -8px"
          v-on="on"
        >
          <v-icon v-if="handle.video" x-small>
            fa-video
          </v-icon>
          <v-icon v-if="!(handle.video)" x-small>
            fa-video-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="handle.video">Camera is on</span>
      <span v-if="!handle.video">Camera is off</span>
    </v-tooltip>
    <v-tooltip v-if="handle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          absolute
          left
          bottom
          outlined
          dark
          x-small
          style="margin-left: 96px !important; bottom: -8px"
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
  </div>
</template>

<script>
export default {
  props: {
    handle: {
      type: Object,
      default: null
    }
  }
}
</script>
