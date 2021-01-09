<template>
  <div v-if="room">
    <v-spacer />
    <v-text-field
      v-model="room.media.publishers"
      :label="$t('comps.room.publishers')"
      name="media.publishers"
      type="number"
      class="mt-4"
      required
      disabled
    />
    <v-spacer />
    <v-text-field
      v-model="room.media.bitrate"
      :label="$t('comps.room.bitrate')"
      name="media.bitrate"
      type="number"
      required
      disabled
    />
    <v-spacer />
    <v-text-field
      v-model="room.media.fir_freq"
      :label="$t('comps.room.firFrequency')"
      name="media.fir_freq"
      type="number"
      required
      disabled
    />
    <v-spacer />
    <v-combobox
      v-model="roomAudioCodecs"
      :items="audiocodecs"
      :label="$t('comps.room.audioCodecs')"
      multiple
      disabled
    />
    <v-spacer />
    <v-combobox
      v-model="roomVideoCodecs"
      :items="videocodecs"
      :label="$t('comps.room.videoCodecs')"
      multiple
      disabled
    />
    <v-spacer />
    <v-switch v-model="room.media.use_sip_bridge" :label="$t('comps.room.sipBridge')" disabled />
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    }
  },
  data () {
    const config = this.$store.state.api.config.config
    const defaults = config.dataSettings.room.defaults.media

    return {
      panel: 0,
      url: config.appSettings.env.URL,
      audiocodecs: defaults.audiocodec.split(','),
      videocodecs: defaults.videocodec.split(',')
    }
  },
  computed: {
    canManage () {
      return this.room && this.user && (this.room.owner === this.user._id || this.room.moderators.includes(this.user._id))
    },
    roomAudioCodecs () {
      return this.room.media.audiocodec.split(',')
    },
    roomVideoCodecs () {
      return this.room.media.videocodec.split(',')
    }
  }
}
</script>
