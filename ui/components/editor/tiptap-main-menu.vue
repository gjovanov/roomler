<template>
  <editor-menu-bar :id="`${elemId}-main-menu`" v-slot="{ commands }" :editor="editor">
    <v-layout v-if="!message || message.edit">
      <v-row>
        <v-col cols="12">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :depressed="!minimal"
                tile
                small
                light
                v-on="on"
                @click="toggleMinimal()"
              >
                <v-icon small>
                  fa-font
                </v-icon>
              </v-btn>
            </template>
            <span>Format</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                tile
                small
                light
                v-on="on"
                @click="attach(commands, 'image')"
              >
                <v-icon small>
                  fa-image
                </v-icon>
              </v-btn>
            </template>
            <span>Insert image</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                tile
                small
                light
                v-on="on"
                @click="attach(commands, 'file')"
              >
                <v-icon small>
                  fa-paperclip
                </v-icon>
              </v-btn>
            </template>
            <span>Attach files</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                tile
                small
                light
                v-on="on"
                @click="openGiphyDialog(commands.iframe)"
              >
                <v-icon>
                  mdi-gif
                </v-icon>
              </v-btn>
            </template>
            <span>Gifs</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                small
                absolute
                right
                tile
                light
                style="right: 0px;"
                v-on="on"
                @click="send()"
              >
                <v-icon small>
                  send
                </v-icon>
              </v-btn>
            </template>
            <span>Send message</span>
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
    }
  }
}
</script>
