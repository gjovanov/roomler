<template>
  <v-form :ref="formRef" v-model="draftRoom.valid" lazy-validation>
    <v-expansion-panels
      v-model="panel"
      accordion
      flat
      tile
      class="pa-0 ma-0"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div>
            <v-icon>
              fa-info
            </v-icon> &nbsp;
            <span>BASIC INFO</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
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
            {{ `${url}/${parentRoom ? parentRoom.path + '.': ''}` }}<em>{{ `${draftRoom.path || 'room_name'}` }}</em>
          </v-chip>
          <v-spacer />
          <v-text-field
            v-model="draftRoom.name"
            :rules="nameRules"
            label="Room name"
            name="name"
            autocomplete="on"
            dense
            outlined
            required
            @keydown.enter.prevent="action()"
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
          <v-combobox
            v-model="draftRoom.tags"
            :items="draftRoom.tags"
            :rules="tagRules"
            label="Tags"
            placeholder="Type in Tag and press Enter"
            multiple
            chips
          >
            <template v-slot:selection="data">
              <v-chip
                :key="JSON.stringify(data.item)"
                v-bind="data.attrs"
                :input-value="data.selected"
                :disabled="data.disabled"
                @click:close="data.parent.selectItem(data.item)"
              >
                {{ data.item }}
              </v-chip>
            </template>
          </v-combobox>
          <v-spacer />
          <v-textarea
            v-model="draftRoom.description"
            label="Description"
            name="description"
            placeholder="Drop few words about the topic of this Room, Team or Community"
            autocomplete="on"
            dense
            outlined
            @keydown.enter.prevent=""
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div>
            <v-icon>
              fa-sliders-h
            </v-icon> &nbsp;
            <span>MEDIA</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-spacer />
          <v-text-field
            v-model.number="draftMedia.publishers"
            label="Publishers"
            name="media.publishers"
            type="number"
            min="1"
            class="mt-4"
            dense
            outlined
            required
          />
          <v-spacer />
          <v-text-field
            v-model.number="draftMedia.bitrate"
            label="Bitrate"
            name="media.bitrate"
            type="number"
            min="0"
            dense
            outlined
            required
          />
          <v-spacer />
          <v-text-field
            v-model.number="draftMedia.fir_freq"
            label="Fir Frequency"
            name="media.fir_freq"
            type="number"
            min="0"
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
          <v-spacer />
          <v-switch v-model="draftMedia.use_sip_bridge" label="Use SIP bridge audio mixing (experimental feature)" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-spacer />
    <v-row>
      <v-spacer v-if="!hasUpdate" />
      <v-btn
        v-if="!hasUpdate"
        :disabled="!draftRoom.valid"
        right
        color="primary"
        class="mt-4 mb-4 ml-4 mr-3"
        outlined
        @click="create()"
      >
        <v-icon>fa-plus</v-icon> &nbsp; Create
      </v-btn>
      <v-spacer v-if="hasUpdate" />
      <v-btn
        v-if="hasUpdate"
        :disabled="!draftRoom.valid"
        right
        color="primary"
        class="mt-4 mb-4 ml-4 mr-3"
        outlined
        @click="update()"
      >
        <v-icon>fa-edit</v-icon> &nbsp; Update
      </v-btn>
    </v-row>
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
    const videocodecs = config.janusSettings.videoCodecs
    const audiocodecs = config.janusSettings.audioCodecs
    if (this.room) {
      this.room.media.audiocodecs = defaults.audiocodec.split(',')
      this.room.media.videocodecs = defaults.videocodec.split(',')
    }
    const draftRoom = this.room ? Object.assign({}, this.room) : {
      valid: true,
      name: null,
      path: '',
      is_open: true,
      description: undefined,
      tags: []
    }
    if (this.room && this.room.short_name) {
      draftRoom.name = this.room.short_name
    }
    const draftMedia = this.room ? Object.assign({}, this.room.media) : {
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
      notify_joining: defaults.notify_joining,
      use_sip_bridge: defaults.use_sip_bridge
    }
    draftRoom.media = draftMedia
    return {

      panel: 0,
      formRef: this.hasUpdate ? 'formUpdate' : 'formCreate',

      maxTagsLength: 5,
      config,
      url: config.appSettings.env.URL,
      slugOptions,

      newTag: null,
      tagRules: [
        v => v.length >= 3 || 'Please select at least 3 tags',
        v => v.length <= this.maxTagsLength || `Exceeding the max number of tags is: ${this.maxTagsLength}`
      ],

      nameRules: [
        v => !!v || 'Room name is required',
        v => /^[a-zA-Z0-9 _-]+$/.test(v) || 'Room name must be composed of only letters, numbers and - or _ character'
      ],

      audiocodecs,
      videocodecs,

      draftRoom,
      draftMedia
    }
  },
  watch: {
    'draftRoom.name' (newName) {
      this.draftRoom.path = slugify(newName, this.slugOptions)
    }
  },
  methods: {
    action () {
      this.hasUpdate ? this.update() : this.create()
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

<style scoped>
* >>> .v-expansion-panel-content__wrap{
    margin: 0px !important;
    padding: 0px !important;
  }
</style>
