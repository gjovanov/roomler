<template>
  <div>
    <div class="editor">
      <tiptap-format-menu
        v-if="!message || message.edit"
        :elem-id="elemId"
        :editor="editor"
        :minimal="minimal"
        @attach="attach"
      />

      <editor-content
        :id="elemId"
        :editor="editor"
        class="editor__content Prose"
      />
      <tiptap-main-menu
        :elem-id="elemId"
        :editor="editor"
        :minimal="minimal"
        :message="message"
        @toggleMinimal="toggleMinimal"
        @attach="attach"
        @send="send"
        @openGiphyDialog="openGiphyDialog"
        @openEmbedDialog="openEmbedDialog"
      />
    </div>

    <div>
      <form v-show="false" method="POST" class="form-documents" enctype="multipart/form-data">
        Upload photos
        <input
          :id="`${elemId}-file-upload`"
          :ref="`${elemId}-file-upload`"
          :name="`${elemId}-file-upload`"
          :multiple="multiple"
          :accept="accept"
          type="file"
          @change="filesChange($event.target.files)"
        >
      </form>
    </div>

    <div>
      <giphy-dialog :dialog="dialog.giphy" @closeGiphyDialog="closeGiphyDialog" @insertGif="insertGif" />
    </div>
    <div>
      <embed-dialog :dialog="dialog.embed" @closeEmbedDialog="closeEmbedDialog" @insertEmbed="insertEmbed" />
    </div>

    <div :ref="customMention.options.templateId">
      <mention-template :extension="customMention" />
    </div>

    <div :ref="customEmoji.options.templateId">
      <emoji-template :extension="customEmoji" />
    </div>
  </div>
</template>

<script>

import GiphyDialog from '@/components/editor/dialogs/giphy-dialog'
import EmbedDialog from '@/components/editor/dialogs/embed-dialog'
import TiptapFormatMenu from '@/components/editor/tiptap-format-menu'
import TiptapMainMenu from '@/components/editor/tiptap-main-menu'
import EmojiTemplate from '@/components/editor/templates/emoji-template'
import MentionTemplate from '@/components/editor/templates/mention-template'
import CustomLink from '@/components/editor/extensions/custom-link'
import CustomMention from '@/components/editor/extensions/custom-mention'
import CustomEmoji from '@/components/editor/extensions/custom-emoji'
import CustomImage from '@/components/editor/extensions/custom-image'
import CustomFile from '@/components/editor/extensions/custom-file'
import Iframe from '@/components/editor/extensions/iframe'
import { Editor, EditorContent, Extension } from 'tiptap'
import { v4 as uuid } from 'uuid'
import {
  Placeholder,
  HardBreak,
  Heading,
  // Mention,
  Code,
  Bold,
  Italic,
  Blockquote,
  CodeBlock,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'

import * as EmojiMap from 'emojilib'
export default {
  components: {
    GiphyDialog,
    EmbedDialog,
    EditorContent,
    TiptapFormatMenu,
    TiptapMainMenu,
    EmojiTemplate,
    MentionTemplate
  },
  props: {
    elemId: {
      type: String,
      default: ''
    },
    users: {
      type: Array,
      default () {
        return []
      }
    },
    gallery: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: '<p></p>'
    },
    isChatPanel: {
      type: Boolean,
      default: false
    },
    message: {
      type: Object,
      default: null
    }
  },
  data () {
    const self = this
    const emojis = EmojiMap.ordered.map((name) => {
      const result = { ...EmojiMap.lib[name], name, key: uuid() }
      return result
    })

    const customMention = new CustomMention({
      $refs: this.$refs,
      mentionClass: 'v-btn v-btn--outlined v-size--small',
      items: () => this.users.map((u) => {
        return { id: u._id, name: u.username, email: u.email, avatarUrl: u.avatar_url }
      }),
      templateId: 'suggestions',
      filterKeys: ['name'],
      attrMapper: (item) => {
        return {
          id: item.id,
          label: item.name,
          avatarUrl: item.avatarUrl || ''
        }
      }
    })

    const customEmoji = new CustomEmoji({
      $refs: this.$refs,
      items: () => this.emojis,
      templateId: 'emojis',
      filterKeys: ['name', 'keywords'],
      filterLimit: 30,
      attrMapper: (item) => {
        return {
          id: item.name,
          label: item.char,
          avatarUrl: ''
        }
      }
    })

    const editor = new Editor({
      editable: !!(!this.message || this.message.edit),
      extensions: [
        new Placeholder({
          showOnlyWhenEditable: true,
          emptyNodeText: 'Write something... Drop & drop files here... Use @ to mention someone. Use : for emoji'
        }),
        new class extends Extension {
          keys () {
            return {
              Enter (state, dispatch, view) {
                if (self.minimal) {
                  self.send()
                }
                // return true prevents default behaviour
                return self.minimal
              }
            }
          }
        }(),
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new TodoItem({
          nested: true
        }),
        new TodoList(),
        new Iframe(),
        new CustomLink(),
        new CustomImage(null, null, self.upload),
        new CustomFile(null, null, self.upload),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new Table({
          resizable: true
        }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        customEmoji,
        customMention,

        new Code(),
        new Bold(),
        new Italic()
      ],
      content: this.content
      // autoFocus: true
    })

    return {
      dialog: {
        giphy: false,
        embed: false
      },
      giphyCommand: null,
      insertCommand: null,
      backup: this.content,
      emojis,
      minimal: true,
      multiple: false,
      accept: '*',
      allCommands: null,
      attachType: 'image', // [image, files]
      editor,
      customMention,
      customEmoji
    }
  },
  watch: {
    'message.edit' (val, oldVal) {
      if (!val) {
        this.editor.setContent(this.backup)
      }
      this.editor.setOptions({
        editable: val
      })
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    openGiphyDialog (command) {
      this.dialog.giphy = true
      this.giphyCommand = command
    },
    openEmbedDialog (command) {
      this.dialog.embed = true
      this.embedCommand = command
    },
    closeGiphyDialog () {
      this.dialog.giphy = false
    },
    closeEmbedDialog () {
      this.dialog.embed = false
    },
    insertGif (gif) {
      if (this.giphyCommand) {
        const url = gif.images.fixed_height ? gif.images.fixed_height.url : gif.images.original.url
        this.giphyCommand({
          src: url,
          alt: gif.title,
          title: gif.title,
          style: 'max-width: 100%; max-height: 200px;'
        })
        this.$nextTick(() => {
          this.editor.view.dom.focus()
        })
      }
      this.dialog.giphy = false
    },
    insertEmbed (url) {
      if (this.embedCommand) {
        this.embedCommand({
          src: url
        })
        this.$nextTick(() => {
          this.editor.view.dom.focus()
        })
      }
      this.dialog.embed = false
    },
    toggleMinimal () {
      this.minimal = !this.minimal
    },
    send () {
      this.$emit('sendMessage', this.editor.getHTML(), this.message)
      // in case of new message being sent, clear the content,
      // otherwise in case of message edit, keep the content
      if (!this.message) {
        this.editor.clearContent()
      }
    },
    async upload (file) {
      const formData = new FormData()
      formData.append('room', this.gallery)
      formData.append('file', file)
      const headers = { 'Content-Type': 'multipart/form-data' }
      const response = await this.$axios.post('api/room/upload', formData, { headers })
      return { filename: file.name, src: response.data.src }
    },
    attach (commands, attachType = 'image') {
      const self = this
      this.allCommands = commands
      this.attachType = attachType
      this.accept = attachType === 'file' ? '*' : 'image/*'
      this.multiple = attachType === 'file'
      this.$nextTick(() => {
        document.getElementById(`${self.elemId}-file-upload`).click()
      })
    },
    async filesChange (files) {
      if (this.allCommands) {
        const result = await Promise.all([...files].map(f => this.upload(f)))
        if (this.attachType === 'file') {
          result.forEach(item => this.allCommands.file({ href: item.src, filename: item.filename }))
        } else {
          result.forEach(item => this.allCommands.image({ src: item.src, alt: item.filename, title: item.filename }))
        }
        document.getElementById(`${this.elemId}-file-upload`).value = ''
      }
    }
  }
}
</script>

<style>
.editor *.is-empty:nth-child(1)::before,
.editor *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaaaaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

.ProseMirror {
  background-color: white;
  color: black;
  border-radius: 5px;
  padding: 10px;
  min-height: 80px;
  outline: none;
  border: 1px solid black;
}
.ProseMirror p {
  margin-bottom: 0px;
}

.ProseMirror-focused {
  border-radius: 5px;
}

ul[data-type=todo_list] {
  padding-left: 0
}

li[data-type=todo_item] {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row
}

.todo-checkbox {
  border: 2px solid #000;
  height: .9em;
  width: .9em;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-right: 10px;
  margin-top: .3rem;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  border-radius: .2em;
  background-color: transparent;
  -webkit-transition: background .4s;
  transition: background .4s
}

.todo-content {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1
}

.todo-content>p:last-of-type {
  margin-bottom: 0
}

.todo-content>ul[data-type=todo_list] {
  margin: .5rem 0
}

li[data-done=true]>.todo-content>p {
  text-decoration: line-through
}

li[data-done=true]>.todo-checkbox {
  background-color: #000
}

li[data-done=false] {
  text-decoration: none
}

.message {
  background-color: rgba(0, 0, 0, .05);
  color: rgba(0, 0, 0, .7);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-style: italic
}

.editor {
  position: relative;
  margin: 0 auto 1rem
}

/* pre img {
  width: 100%;
} */

.editor__content {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word
}

.editor__content * {
  caret-color: currentColor
}

.editor__content pre {
  padding: .7rem 1rem;
  border-radius: 5px;
  background: #000;
  color: #fff;
  font-size: .8rem;
  overflow-x: auto
}

.editor__content pre code {
  display: block
}

.editor__content p code {
  display: inline-block;
  padding: 0 .4rem;
  border-radius: 5px;
  font-size: .8rem;
  font-weight: 700;
  background: rgba(0, 0, 0, .1);
  color: rgba(0, 0, 0, .8)
}

.editor__content blockquote {
    border-left: 3px solid rgba(0, 0, 0, .1);
    color: rgba(0, 0, 0, .8);
    padding-left: .8rem;
    font-style: italic;
}
.editor__content ol,
.editor__content ul {
  padding-left: 1rem
}

.editor__content li>ol,
.editor__content li>p,
.editor__content li>ul {
  margin: 0
}

.editor__content a {
  color: inherit
}

.editor__content blockquote {
  border-left: 3px solid rgba(0, 0, 0, .1);
  color: rgba(0, 0, 0, .8);
  padding-left: .8rem;
  font-style: italic
}

.editor__content blockquote p {
  margin: 0
}

.editor__content img {
  max-width: 100%;
  border-radius: 3px
}

.editor__content table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden
}

.editor__content table td,
.editor__content table th {
  min-width: 1em;
  border: 2px solid #ddd;
  padding: 3px 5px;
  vertical-align: top;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative
}

.editor__content table td>*,
.editor__content table th>* {
  margin-bottom: 0
}

.editor__content table th {
  font-weight: 700;
  text-align: left
}

.editor__content table .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(200, 200, 255, .4);
  pointer-events: none
}

.editor__content table .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  z-index: 20;
  background-color: #adf;
  pointer-events: none
}

.editor__content .tableWrapper {
  margin: 1em 0;
  overflow-x: auto
}

.editor__content .resize-cursor {
  cursor: ew-resize;
  cursor: col-resize
}

.mention {
  background: rgba(0, 0, 0, .1);
  font-size: .8rem;
  font-weight: 700;
  border-radius: 5px;
  padding: .2rem .5rem;
  white-space: nowrap
}

.mention,
.mention-suggestion {
  color: rgba(0, 0, 0, .6)
}

.editor__content table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden;
}

.editor__content * {
  caret-color: currentColor;
}

table {
  width: 100%;
  display: table;
  border-collapse: separate;
  border-spacing: 2px;
  border-color: #fff;
}

.iframe_embed {
  max-width: 100%;
  width: 100%;
  height: 15rem;
  border: 0;
}
</style>
