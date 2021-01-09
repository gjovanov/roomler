<template>
  <editor-menu-bar :id="`${elemId}-main-menu`" v-slot="{ commands }" :editor="editor">
    <v-layout v-if="!message || message.edit" class="pt-2">
      <v-row>
        <v-col cols="12">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                fab
                x-small
                :dark="!isDark && minimal"
                :light="isDark && minimal"
                elevation="0"
                v-on="on"
                @click="toggleMinimal()"
              >
                <v-icon x-small>
                  fa-font
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.format') }}
            </span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                fab
                x-small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="attach(commands, 'image')"
              >
                <v-icon x-small>
                  fa-image
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.insertImage') }}
            </span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                fab
                x-small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="attach(commands, 'file')"
              >
                <v-icon x-small>
                  fa-paperclip
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.attachFiles') }}
            </span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                fab
                x-small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="openEmbedDialog(commands.iframe)"
              >
                <v-icon x-small>
                  fa fa-link
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.embedUrl') }}
            </span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                fab
                x-small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="openGiphyDialog(commands.image)"
              >
                <v-icon>
                  mdi-sticker-emoji
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.gifsStickers') }}
            </span>
          </v-tooltip>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                x-small
                absolute
                right
                fab
                :color="$vuetify.theme.themes[theme].primary"
                :dark="!isDark"
                :light="isDark"
                style="right: 0px;"
                elevation="0"
                v-on="on"
                @click="send()"
              >
                <v-icon x-small>
                  send
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.sendMessage') }}
            </span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-layout>
  </editor-menu-bar>
</template>

<script>
import { EditorMenuBar } from 'tiptap'

export default {
  components: {
    EditorMenuBar
  },
  props: {
    elemId: {
      type: String,
      default: ''
    },
    editor: {
      type: Object,
      default: null
    },
    minimal: {
      type: Boolean,
      default: false
    },
    message: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      menu: true,
      sub_menu: true
    }
  },
  computed: {
    theme () {
      return this.$vuetify.theme.isDark ? 'dark' : 'light'
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    toggleMinimal () {
      this.$emit('toggleMinimal')
    },
    attach (comms, attachType) {
      this.$emit('attach', comms, attachType)
    },
    send () {
      this.$emit('send')
    },
    openGiphyDialog (command) {
      this.$emit('openGiphyDialog', command)
    },
    openEmbedDialog (command) {
      this.$emit('openEmbedDialog', command)
    }
  }
}
</script>
