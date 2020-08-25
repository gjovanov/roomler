<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card>
      <v-card-title>Embed URL</v-card-title>
      <v-card-text>
        <v-form
          ref="formEmbed"
          v-model="isValidEmbed"
          lazy-validation
          @submit.prevent
        >
          <v-text-field
            v-model="url"
            :rules="urlRules"
            label="Url"
            name="url"
            autocomplete="on"
            required
            @keydown.enter.prevent="insert()"
          />
          <v-spacer />
          <iframe :src="convertedUrl" class="iframe_embed" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="grey"
          outlined
          class="ma-3"
          @click="cancel()"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!isValidEmbed"
          type="submit"
          color="primary"
          outlined
          class="ma-3"
          @click="insert()"
        >
          Insert
        </v-btn>
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
    }
  },
  data () {
    return {
      url: null,
      isValidEmbed: false,
      urlRules: [
        v => !!v || 'URL is required',
        v => /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.?[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g.test(v)
      ]
    }
  },
  computed: {
    convertedUrl () {
      const self = this
      const youtubeExpression = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/i
      if (youtubeExpression.test(self.url)) {
        const parts = youtubeExpression.exec(self.url)
        if (parts && parts.length > 0) {
          return `https://www.youtube-nocookie.com/embed/${parts[1]}`
        }
      }
      const vimeoExpression = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/i
      if (vimeoExpression.test(self.url)) {
        const parts = vimeoExpression.exec(self.url)
        if (parts && parts.length > 0) {
          return `https://player.vimeo.com/video/${parts[1]}`
        }
      }
      return self.url
    }
  },

  methods: {
    insert () {
      if (this.$refs.formEmbed.validate()) {
        this.$emit('insertEmbed', this.convertedUrl)
        this.url = null
      }
    },
    cancel () {
      this.$emit('closeEmbedDialog')
      this.url = null
    }
  }
}
</script>
