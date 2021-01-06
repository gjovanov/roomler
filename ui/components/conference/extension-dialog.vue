<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        {{ $t('comps.conference.missingExtension') }}
      </v-card-title>
      <v-card-text>
        {{ $t('comps.conference.installExtension') }}
      </v-card-text>
      <v-spacer />

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green darken-1"
          outlined
          tile
          elevation="0"
          @click="cancel()"
        >
          {{ $t('comps.conference.cancel') }}
        </v-btn>

        <v-btn
          color="green darken-1"
          outlined
          tile
          link
          href="https://chrome.google.com/webstore/detail/janus-webrtc-screensharin/hapfgfdkleiggjjpfpenajgdnfckjpaj"
          target="_blank"
          elevation="0"
        >
          {{ $t('comps.conference.install') }}
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
      dialog: false
    }
  },
  watch: {
    open (newVal) {
      this.dialog = newVal
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
