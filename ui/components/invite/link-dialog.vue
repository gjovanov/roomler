<template>
  <v-dialog v-model="dialog" persistent retain-focus max-width="800px">
    <v-card v-if="room">
      <v-expansion-panels
        v-model="panel"
        accordion
        tile
        flat
      >
        <v-expansion-panel>
          <v-expansion-panel-header>SHARE THIS LINK</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form>
              <v-text-field
                ref="textToCopy"
                v-model="link"
                :hint="tooltip"
                persistent-hint
                outlined
              />
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-actions>
        <v-btn
          color="grey"
          outlined
          class="ma-3"
          @click="close()"
        >
          Close
        </v-btn>
        <v-spacer />

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              outlined
              class="ma-3"
              @click="copyToClipboard()"
              v-on="on"
            >
              Copy link
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
    const config = this.$store.state.api.config.config
    const url = config.appSettings.env.URL
    const types = config.dataSettings.invite.types

    return {
      panel: 0,
      url,
      types,
      type: 'member',
      tooltip: 'Copy to clipboard'
    }
  },
  computed: {
    link () {
      return `${this.url}/${this.room.path}/join`
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
      this.tooltip = 'Link copied!'
      setTimeout(() => {
        self.tooltip = 'Copy to clipboard'
      }, 1000)
    }
  }
}
</script>
