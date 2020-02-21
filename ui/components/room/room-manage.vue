<template>
  <v-form :ref="formRef" v-model="draftRoom.valid" lazy-validation>
    <v-expansion-panels
      v-model="panel"
      accordion
      tile
      flat
      class="pa-0 ma-0"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>Basic info</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-spacer v-if="!hasUpdate" />
          <strong v-if="!hasUpdate" class="text-primary">Room URL: </strong>
          <v-chip
            v-if="!hasUpdate"
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
          <v-spacer v-if="!hasUpdate" />
          <v-text-field
            v-if="!hasUpdate"
            v-model="draftRoom.name"
            :rules="nameRules"
            label="Room name"
            name="name"
            autocomplete="on"
            dense
            outlined
            required
            :disabled="hasUpdate"
            @keydown.enter.prevent="create()"
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
          <v-switch v-if="hasUpdate" v-model="draftRoom.is_open" :label="draftRoom.is_open ? 'Open' : 'Closed'" />
          <v-spacer />
          <v-text-field
            v-model="newTag"
            label="Tag"
            name="tag"
            autocomplete="on"
            placeholder="Add a tag and press 'Enter'"
            dense
            outlined
            required
            @keydown.enter.prevent="addTag()"
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
                    class="ma-2"
                    outlined
                    close
                    @click:close="removeTag(tag)"
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
            label="Description"
            name="description"
            autocomplete="on"
            dense
            outlined
            @keydown.enter.prevent=""
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Media
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            v-model="draftMedia.publishers"
            label="Publishers"
            name="media.publishers"
            type="number"
            dense
            outlined
            required
          />
          <v-spacer />
          <v-text-field
            v-model="draftMedia.bitrate"
            label="Bitrate"
            name="media.bitrate"
            type="number"
            dense
            outlined
            required
          />
          <v-spacer />
          <v-text-field
            v-model="draftMedia.fir_freq"
            label="Fir Frequency"
            name="media.fir_freq"
            type="number"
            dense
            outlined
            required
          />
          <v-spacer />
          <v-combobox
            v-model="draftMedia.audiocodecs"
            :items="audiocodecs"
            label="Audio codecs"
            hint="For multiple values selected, the order is important"
            persistent-hint
            dense
            multiple
            outlined
          />
          <v-spacer />
          <v-combobox
            v-model="draftMedia.videocodecs"
            :items="videocodecs"
            label="Video codecs"
            hint="For multiple values selected, the order is important"
            persistent-hint
            dense
            multiple
            outlined
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-form>
</template>
<script>
import slugify from 'slugify'

export default {
  props: {
    parentRoom: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    },
    media: {
      type: Object,
      default: null
    },
    hasUpdate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const slugOptions = {
      replacement: '-', // replace spaces with replacement
      remove: null, // regex to remove characters
      lower: true // result in lower case
    }
    const config = this.$store.state.api.config.config
    const defaults = config.dataSettings.room.defaults.media

    return {

      panel: 0,
      formRef: this.hasUpdate ? 'formUpdate' : 'formCreate',

      maxTagsLength: 5,
      config,
      url: config.appSettings.env.URL,
      slugOptions,

      newTag: null,

      nameRules: [
        v => !!v || 'Room name is required',
        v => /^[a-zA-Z0-9 _-]+$/.test(v) || 'Room name must be composed of only letters, numbers and - or _ character'
      ],

      audiocodecs: defaults.audiocodec.split(','),
      videocodecs: defaults.videocodec.split(','),

      draftRoom: this.room ? JSON.parse(JSON.stringify(this.room)) : {
        valid: true,
        name: null,
        path: '',
        is_open: true,
        description: undefined,
        tags: []
      },
      draftMedia: this.room && this.room.media ? JSON.parse(JSON.stringify(this.room.media)) : {
        roomid: undefined,
        permanent: true,
        publishers: defaults.publishers,
        is_private: undefined,
        secret: undefined,
        pin: undefined,
        bitrate: defaults.bitrate,
        fir_freq: defaults.fir_freq,
        audiocodecs: defaults.audiocodec.split(','),
        videocodecs: defaults.videocodec.split(','),
        record: defaults.record,
        rec_dir: undefined,
        notify_joining: defaults.notify_joining
      }
    }
  },
  watch: {
    'draftRoom.name' (newName) {
      this.draftRoom.path = slugify(newName, this.slugOptions)
    },
    'draftRoom.valid' (newVal) {
      this.$emit('updateValid', newVal)
    }
  },
  methods: {
    addTag () {
      if (this.newTag && !this.draftRoom.tags.includes(this.newTag) && this.draftRoom.tags.length < this.maxTagsLength) {
        this.draftRoom.tags.push(this.newTag)
        this.newTag = null
      }
    },
    removeTag (tag) {
      this.draftRoom.tags = this.draftRoom.tags.filter(t => t !== tag)
    },
    create () {
      if (this.$refs[this.formRef].validate()) {
        this.$emit('create', this.draftRoom, this.draftMedia)
      }
    },
    update () {
      if (this.$refs[this.formRef].validate()) {
        this.$emit('update', this.draftRoom, this.draftMedia)
      }
    }
  }
}
</script>
