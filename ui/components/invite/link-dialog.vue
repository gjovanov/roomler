<template>
  <v-dialog v-model="dialog" persistent retain-focus max-width="800px">
    <v-card v-if="room">
      <v-card-title>
        {{ $t('comps.invite.shareThisLink') }}
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            ref="textToCopy"
            v-model="link"
            :hint="tooltip"
            persistent-hint
            outlined
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="grey"
          outlined
          class="ma-3"
          @click="close()"
        >
          {{ $t('comps.invite.close') }}
        </v-btn>
        <v-spacer />

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              color="primary"
              outlined
              class="ma-3"
              @click="copyToClipboard()"
              v-on="on"
            >
              {{ $t('comps.invite.copyLink') }}
            </v-btn>
          </template>
          <span>{{ tooltip }}</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    room: {
      type: Object,
      default: null
    }
  },
  data () {
    const self = this
    const config = this.$store.state.api.config.config
    const url = config.appSettings.env.URL
    const types = config.dataSettings.invite.types

    return {
      panel: 0,
      url,
      types,
      type: 'member',
      tooltip: self.$t('comps.invite.copyToClipboard')
    }
  },
  computed: {
    link () {
      return `${this.url}/${this.room.path}/join`
    }
  },
  watch: {
    dialog (newVal) {
      const self = this
      if (newVal) {
        self.tooltip = self.$t('comps.invite.copyToClipboard')
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
      this.invites = []
    },
    copyToClipboard () {
      const self = this
      const textToCopy = this.$refs.textToCopy.$el.querySelector('input')
      textToCopy.select()
      document.execCommand('copy')
      this.tooltip = self.$t('comps.invite.linkCopied')
      setTimeout(() => {
        self.tooltip = self.$t('comps.invite.copyToClipboard')
      }, 1000)
    }
  }
}
</script>
