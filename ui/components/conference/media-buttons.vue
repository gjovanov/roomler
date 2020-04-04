<template>
  <div
    v-if="handle"
  >
    <v-btn
      fab
      absolute
      left
      bottom
      outlined
      dark
      x-small
      style="bottom: -8px"
    >
      <v-icon v-if="handle.audio" x-small>
        fa-microphone
      </v-icon>
      <v-icon v-if="!(handle.audio)" x-small>
        fa-microphone-slash
      </v-icon>
    </v-btn>
    <v-btn
      fab
      absolute
      left
      bottom
      outlined
      dark
      x-small
      style="margin-left: 48px !important; bottom: -8px"
    >
      <v-icon v-if="handle.video" x-small>
        fa-video
      </v-icon>
      <v-icon v-if="!(handle.video)" x-small>
        fa-video-slash
      </v-icon>
    </v-btn>
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
