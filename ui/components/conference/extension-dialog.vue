<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        Missing screen sharing extension
      </v-card-title>
      <v-card-text>
        You need to install this extension to be able to share your screen.
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
          color="green darken-1"
          outlined
          link
          href="https://chrome.google.com/webstore/detail/janus-webrtc-screensharin/hapfgfdkleiggjjpfpenajgdnfckjpaj"
          target="_blank"
        >
          Install
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
