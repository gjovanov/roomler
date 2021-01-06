<template>
  <v-form :ref="formRef" v-model="draftRoom.valid" lazy-validation>
    <add-emoji-menu
      :open="menu.addEmoji.open"
      :emojis="emojis"
      :x="menu.addEmoji.x"
      :y="menu.addEmoji.y"
      :message="menu.addEmoji.message"
      @addEmoji="addEmoji"
      @hideMenu="hideMenu"
    />
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
            <span class="text-uppercase">{{ $t('pages.@.room.manage.basicInfo') }}</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-spacer />
          <strong class="text-primary">{{ $t('pages.@.room.manage.roomUrl') }}</strong>
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
            :label="$t('pages.@.room.manage.roomName')"
            name="name"
            autocomplete="on"
            dense
            outlined
            required
            @keydown.enter.prevent="action()"
          >
            <template #append>
              <v-tooltip
                bottom
              >
                <template #activator="{ on }">
                  <v-icon
                    v-on="on"
                    @click="draftRoom.is_open = !draftRoom.is_open"
                  >
                    {{ `${draftRoom.is_open ? 'fa-lock-open' : 'fa-lock'}` }}
                  </v-icon>
                </template>
                {{ `${draftRoom.is_open ? $t('pages.@.room.manage.openRoom') : $t('pages.@.room.manage.closedRoom')}` }}
              </v-tooltip>
            </template>
          </v-text-field>
          <v-spacer />
          <v-text-field
            v-model="draftRoom.emoji"
            :label="$t('comps.room.emoji')"
            name="emoji"
            dense
            outlined
            required
            readonly
            @click="showMenu($event, 'addEmoji')"
          />
          <v-spacer />
          <v-combobox
            v-model="draftRoom.tags"
            :items="draftRoom.tags"
            :rules="tagRules"
            :label="$t('pages.@.room.manage.tags')"
            :placeholder="$t('pages.@.room.manage.tagsPlaceholder')"
            multiple
            chips
          >
            <template #selection="data">
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
            :label="$t('pages.@.room.manage.description')"
            name="description"
            :placeholder="$t('pages.@.room.manage.descriptionPlaceholder')"
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
            <span class="text-uppercase">{{ $t('pages.@.room.manage.media') }}</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-spacer />
          <v-text-field
            v-model.number="draftMedia.publishers"
            :label="$t('pages.@.room.manage.publishers')"
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
            :label="$t('pages.@.room.manage.bitrate')"
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
            :label="$t('pages.@.room.manage.firFrequency')"
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
            :label="$t('pages.@.room.manage.audioCodecs')"
            :hint="$t('pages.@.room.manage.audioCodecsHint')"
            persistent-hint
            dense
            multiple
            outlined
          />
          <v-spacer />
          <v-combobox
            v-model="draftMedia.videocodecs"
            :items="videocodecs"
            :label="$t('pages.@.room.manage.videoCodecs')"
            :hint="$t('pages.@.room.manage.videoCodecsHint')"
            persistent-hint
            dense
            multiple
            outlined
          />
          <v-spacer />
          <v-switch v-model="draftMedia.use_sip_bridge" :label="$t('pages.@.room.manage.sipBridge')" />
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
        elevation="0"
        @click="create()"
      >
        <v-icon>fa-plus</v-icon> &nbsp; {{ $t('pages.@.room.manage.create') }}
      </v-btn>
      <v-spacer v-if="hasUpdate" />
      <v-btn
        v-if="hasUpdate"
        :disabled="!draftRoom.valid"
        right
        color="primary"
        class="mt-4 mb-4 ml-4 mr-3"
        outlined
        elevation="0"
        @click="update()"
      >
        <v-icon>fa-edit</v-icon> &nbsp; {{ $t('pages.@.room.manage.update') }}
      </v-btn>
    </v-row>
  </v-form>
</template>
<script>
import slugify from 'slugify'
import AddEmojiMenu from '@/components/room/add-emoji-menu'
import * as EmojiMap from 'emojilib'
import { v4 as uuid } from 'uuid'

export default {
  components: {
    AddEmojiMenu
  },
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
    const self = this
    const slugOptions = {
      replacement: '-', // replace spaces with replacement
      remove: null, // regex to remove characters
      lower: true // result in lower case
    }
    const emojis = EmojiMap.ordered.map((name) => {
      const result = { ...EmojiMap.lib[name], name, key: uuid() }
      return result
    })
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
      emoji: '💥',
      is_open: true,
      description: undefined,
      tags: []
    }
    if (!draftRoom.emoji) {
      draftRoom.emoji = '💥'
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
      emojis,
      menu: {
        addEmoji: {
          x: 0,
          y: 0,
          open: false,
          message: null
        }
      },

      panel: 0,
      formRef: this.hasUpdate ? 'formUpdate' : 'formCreate',

      maxTagsLength: 15,
      config,
      url: config.appSettings.env.URL,
      slugOptions,

      newTag: null,
      tagRules: [
        v => v.length >= 3 || self.$t('pages.@.room.manage.tagMinLimit'),
        v => v.length <= this.maxTagsLength || `${self.$t('pages.@.room.manage.tagMaxLimit')} ${this.maxTagsLength}`
      ],

      nameRules: [
        v => !!v || self.$t('pages.@.room.manage.roomNameRequired'),
        v => /^[a-zA-Z0-9 _-]+$/.test(v) || self.$t('pages.@.room.manage.roomNameChars')
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
    },
    showMenu (e, type) {
      this.menu[type].x = e.clientX
      this.menu[type].y = e.clientY - 100
      this.menu[type].open = true
    },
    hideMenu (type) {
      this.menu[type].open = false
    },
    addEmoji (emoji) {
      this.draftRoom.emoji = emoji.char
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
