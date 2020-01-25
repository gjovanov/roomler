<template>
  <client-only>
    <v-layout>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="8"
        >
          <v-card>
            <v-card-title>
              Create a Room
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="draftRoom.valid" lazy-validation>
                <v-spacer />
                <strong class="text-primary">Room URL: </strong>
                <v-chip
                  class="ma-2"
                  color="primary"
                  outlined
                  pill
                >
                  <v-icon left>
                    fa-globe
                  </v-icon>
                  {{ `${url}/${parentRoom ? parentRoom.path + '.': ''}` }}<em>{{ `${draftRoom.path || 'your_room_name'}` }}</em>
                </v-chip>
                <v-spacer />
                <v-text-field
                  v-model="draftRoom.name"
                  :rules="nameRules"
                  @keydown.enter.prevent="create()"
                  label="Room name"
                  name="name"
                  autocomplete="on"
                  outlined
                  required
                >
                  <template v-slot:append>
                    <v-tooltip
                      bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          @click="draftRoom.is_open = !draftRoom.is_open"
                        >
                          {{ `${draftRoom.is_open ? 'fa-lock-open' : 'fa-lock'}` }}
                        </v-icon>
                      </template>
                      {{ `${draftRoom.is_open ? 'Open room (join allowed to everyone)' : 'Closed room (invite-only join)'}` }}
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-spacer />
                <v-text-field
                  v-model="newTag"
                  @keydown.enter.prevent="addTag()"
                  label="Tag"
                  name="tag"
                  autocomplete="on"
                  placeholder="Add a tag and press 'Enter'"
                  outlined
                  required
                />
                <v-spacer />
                <v-row v-if="draftRoom.tags.length" justify="space-around">
                  <v-col cols="12" sm="12">
                    <v-sheet>
                      <v-alert
                        border="left"
                        dense
                        outlined
                        color="primary"
                        elevation="2"
                      >
                        {{ `Max ${maxTagsLength} Tags (Left: ${maxTagsLength - draftRoom.tags.length})` }}
                      </v-alert>
                      <v-chip-group
                        column
                        active-class="primary--text"
                      >
                        <v-chip
                          v-for="tag in draftRoom.tags"
                          :key="tag"
                          @click:close="removeTag(tag)"
                          class="ma-2"
                          outlined
                          close
                        >
                          {{ tag }}
                        </v-chip>
                      </v-chip-group>
                    </v-sheet>
                  </v-col>
                </v-row>
                <v-spacer />
                <v-textarea
                  v-model="draftRoom.description"
                  @keydown.enter.prevent=""
                  label="Description"
                  name="description"
                  autocomplete="on"
                  outlined
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!draftRoom.valid"
                @click="create()"
                color="primary"
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
import slugify from 'slugify'
import {
  handleSuccess
} from '@/services/ajax-handlers'

export default {
  middleware: 'authenticated',
  data () {
    const slugOptions = {
      replacement: '-', // replace spaces with replacement
      remove: null, // regex to remove characters
      lower: true // result in lower case
    }
    const defaultRoom = {
      valid: true,
      name: null,
      path: '',
      is_open: true,
      description: undefined,
      tags: []
    }
    const config = this.$store.state.api.config.config
    const defaults = config.dataSettings.room.defaults.media

    return {
      valid: true,

      maxTagsLength: 5,
      config,
      url: config.appSettings.env.URL,
      slugOptions,

      draftRoom: JSON.parse(JSON.stringify(defaultRoom)),
      newTag: null,

      nameRules: [
        v => !!v || 'Room name is required',
        v => /^[a-zA-Z0-9 _-]+$/.test(v) || 'Room name must be composed of only letters, numbers and - or _ character'
      ],

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
        rec_dir: undefined,
        notify_joining: defaults.notify_joining
      }
    }
  },
  computed: {
    parentRoom () {
      const result = this.$store.state.api.room.rooms.find(r => r.path === this.$route.query.parent)
      return result
    }
  },

  watch: {
    'draftRoom.name' (newName) {
      this.draftRoom.path = slugify(newName, this.slugOptions)
    }
  },
  methods: {
    addTag () {
      if (!this.draftRoom.tags.includes(this.newTag) && this.draftRoom.tags.length < this.maxTagsLength) {
        this.draftRoom.tags.push(this.newTag)
        this.newTag = null
      }
    },
    removeTag (tag) {
      this.draftRoom.tags = this.draftRoom.tags.filter(t => t !== tag)
    },

    async create () {
      if (this.$refs.form.validate()) {
        // 1. create a room in our DB via the /api/room/create
        // 2. create a room in Janus
        // 3. update the Janus roomid in our DB via /api/room/update
        const createPayload = {
          name: this.draftRoom.name,
          description: this.draftRoom.description,
          is_open: this.draftRoom.is_open,
          tags: this.draftRoom.tags,
          media: this.media
        }

        if (this.parentRoom) {
          createPayload.parent_name = this.parentRoom.name
          createPayload.parent_path = this.parentRoom.path
        }
        const createResponse = await this.$store.dispatch('api/room/create', createPayload)
        if (!createResponse.hasError) {
          let room = createResponse.result
          const janusPayload = Object.assign({}, this.media)
          janusPayload.is_private = !this.draftRoom.is_open
          janusPayload.description = this.draftRoom.name
          janusPayload.permanent = true
          const janusRoom = await this.$store.dispatch('api/janus/videoroom/createRoom', janusPayload)

          const updatePayload = { id: room._id, update: { 'media.roomid': janusRoom.room } }
          const updateResponse = await this.$store.dispatch('api/room/update', updatePayload)
          if (!updateResponse.hasError) {
            room = updateResponse.result
            handleSuccess('The room was created successfully. It\'s more fun with friends so let\'s invite some', this.$store.commit)
            this.$router.push({ path: `/${room.path}` })
          }
        }
      }
    }
  }
}
</script>
