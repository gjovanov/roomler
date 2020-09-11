<template>
  <div v-if="room">
    <v-spacer />
    <v-text-field
      v-model="room.media.publishers"
      label="Publishers"
      name="media.publishers"
      type="number"
      class="mt-4"
      required
      disabled
    />
    <v-spacer />
    <v-text-field
      v-model="room.media.bitrate"
      label="Bitrate"
      name="media.bitrate"
      type="number"
      required
      disabled
    />
    <v-spacer />
    <v-text-field
      v-model="room.media.fir_freq"
      label="Fir Frequency"
      name="media.fir_freq"
      type="number"
      required
      disabled
    />
    <v-spacer />
    <v-combobox
      v-model="roomAudioCodecs"
      :items="audiocodecs"
      label="Audio codecs"
      multiple
      disabled
    />
    <v-spacer />
    <v-combobox
      v-model="roomVideoCodecs"
      :items="videocodecs"
      label="Video codecs"
      multiple
      disabled
    />
    <v-spacer />
    <v-switch v-model="room.media.use_sip_bridge" label="Use SIP bridge audio mixing (experimental feature)" disabled />
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
