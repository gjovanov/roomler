<template>
  <v-flex
    v-if="handle && conferencePosition === 'center'"
    class="d-flex align-content-start align-center justify-center"
  >
    <v-tooltip v-if="handle" bottom left>
      <template #activator="{ on }">
        <v-btn
          fab
          outlined
          dark
          :ripple="false"
          x-small
          :color="handle.media.audio.enabled && !handle.media.audio.muted ? 'green' : 'red'"
          style="bottom: 24px"
          elevation="0"
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
      <span v-if="handle.media.audio.enabled && !handle.media.audio.muted">
        {{ $t('comps.conference.microphoneOn') }}
      </span>
      <span v-if="!(handle.media.audio.enabled && !handle.media.audio.muted)">
        {{ $t('comps.conference.microphoneOff') }}
      </span>
    </v-tooltip>

    <v-tooltip v-if="handle" bottom left>
      <template #activator="{ on }">
        <v-btn
          fab
          outlined
          dark
          :ripple="false"
          x-small
          :color="handle.media.video.enabled && !handle.media.video.muted ? 'green' : 'red'"
          style="bottom: 24px"
          elevation="0"
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
      <span v-if="handle.media.video.enabled && !handle.media.video.muted">
        {{ $t('comps.conference.cameraOn') }}
      </span>
      <span v-if="!(handle.media.video.enabled && !handle.media.video.muted)">
        {{ $t('comps.conference.cameraOff') }}
      </span>
    </v-tooltip>

    <v-tooltip v-if="handle" bottom left>
      <template #activator="{ on }">
        <v-btn
          fab
          outlined
          dark
          :ripple="false"
          x-small
          :color="handle.media.screen.enabled ? 'green' : 'red'"
          style="bottom: 24px"
          elevation="0"
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
      <span v-if="handle.media.screen.enabled">
        {{ $t('comps.conference.screenOn') }}
      </span>
      <span v-if="!handle.media.screen.enabled">
        {{ $t('comps.conference.screenOff') }}
      </span>
    </v-tooltip>
    <v-tooltip v-if="handle && !handle.isLocal" bottom left>
      <template #activator="{ on }">
        <v-btn
          tile
          left
          dark
          right
          :ripple="false"
          x-small
          style="bottom: 24px"
          v-on="on"
        >
          {{ handle.bitrate.value }}
        </v-btn>
      </template>
      <span>
        {{ $t('comps.conference.bitrate') }}
      </span>
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
