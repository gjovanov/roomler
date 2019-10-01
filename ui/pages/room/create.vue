<template>
  <client-only>
    <v-layout>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="elevation-12">
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="Room name"
                  name="name"
                  autocomplete="on"
                  required
                />
                <v-spacer />
                <v-text-field
                  v-model="description"
                  label="Description"
                  name="description"
                  autocomplete="on"
                />
                <v-spacer />
                <v-switch
                  v-model="is_open"
                  label="is open"
                />
                <v-spacer />
                <div class="text-center">
                  <v-chip
                    v-for="tag in tags"
                    :key="tag"
                    class="ma-2"
                    outlined
                    close
                    @click:close="removeTag(tag)"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
                <v-spacer />
                <v-text-field
                  v-model="newTag"
                  label="New tag"
                  name="newTag"
                  autocomplete="on"
                  @keyup.enter="addTag()"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!valid"
                color="primary"
                @click="create()"
              >
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </client-only>
</template>

<script>
import {
  handleSuccess
} from '@/services/ajax-handlers'

const config = require('@@/config')
const defaults = config.dataSettings.room.defaults.media

export default {
  middleware: 'authenticated',
  data () {
    return {
      valid: true,

      name: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 4) || 'Name must be at least 4 characters',
        v => /^[a-zA-Z0-9_-]+$/.test(v) || 'Name must be composed of only letters, numbers and - or _ character'
      ],

      description: undefined,

      is_open: false,

      tags: [],
      newTag: null,

      media: {
        roomid: undefined,
        permanent: true,
        publishers: defaults.publishers,
        is_private: undefined,
        secret: undefined,
        pin: undefined,
        bitrate: defaults.bitrate,
        fir_freq: defaults.fir_freq,
        audiocodec: defaults.audiocodec,
        videocodec: defaults.videocodec,
        record: defaults.record,
        rec_dir: undefined
      }
    }
  },
  computed: {
    janusPayload () {
      const payload = {
        media: Object.assign({}, this.media),
        plugin: config.janusSettings.plugins.videoroom
      }
      payload.media.request = 'create'
      payload.media.is_private = !this.is_open
      payload.media.description = this.description
      return payload
    },
    apiPayload () {
      const payload = {
        name: this.name,
        description: this.description,
        is_open: this.is_open,
        tags: this.tags,
        media: this.media
      }
      return payload
    }
  },
  created () {
    if (this.$route.query.email) {
      this.email = this.$route.query.email
    }
    if (this.$route.query.username) {
      this.username = this.$route.query.username
    }
  },
  methods: {

    addTag () {
      this.tags.push(this.newTag)
      this.newTag = null
    },
    removeTag (tag) {
      this.tags = this.tags.filter(t => t !== tag)
    },
    async create () {
      if (this.$refs.form.validate()) {
        const room = await this.$store.dispatch('janus/createRoom', this.janusPayload)
        console.log(room)
        this.media.roomid = room.room
        console.log(this.media)
        console.log(this.apiPayload)

        const response = await this.$store.dispatch('room/create', this.apiPayload)
        if (!response.hasError) {
          handleSuccess('The room was created successfully. It\'s more fun with friends so let\'s invite some', this.$store.commit)
          this.$router.push({ path: `/invite/${this.name}` })
        }
      }
    }
  }
}
</script>
