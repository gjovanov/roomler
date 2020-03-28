<template>
  <div>
    <div class="editor">
      <tiptap-menu :editor="editor" :minimal="minimal" />

      <v-divider />

      <editor-content
        :id="elemId"
        :editor="editor"
        class="editor__content Prose"
      />
      <v-layout>
        <v-row>
          <v-col cols="12">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  :text="!minimal"
                  small
                  tile
                  light
                  v-on="on"
                  @click="minimal = !minimal"
                >
                  <v-icon small>
                    fa-edit
                  </v-icon>
                </v-btn>
              </template>
              <span>Format</span>
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

import TiptapMenu from '@/components/editor/tiptap-menu'
import EmojiTemplate from '@/components/editor/templates/emoji-template'
import MentionTemplate from '@/components/editor/templates/mention-template'
import CustomMention from '@/components/editor/extensions/custom-mention'
import CustomEmoji from '@/components/editor/extensions/custom-emoji'
import CustomImage from '@/components/editor/extensions/custom-image'
import * as uuid from 'uuid/v4'
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
  Link,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'
import { Editor, EditorContent, Extension } from 'tiptap'
import * as EmojiMap from 'emojilib'
export default {
  components: {
    EditorContent,
    TiptapMenu,
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
      extensions: [
        new Placeholder({
          showOnlyWhenEditable: true,
          emptyNodeText: 'Write something... Use @ to mention someone. Use : for emoji'
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
        new Link(),
        new CustomImage(null, null, self.upload),
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
      content: '<p></p>',
      autoFocus: true
    })

    return {
      emojis,
      minimal: true,
      editor,
      customMention,
      customEmoji
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    send () {
      this.$emit('sendMessage', this.editor.getHTML())
      this.editor.clearContent()
    },
    async upload (file) {
      const formData = new FormData()
      formData.append('room', this.gallery)
      formData.append('file', file)
      const headers = { 'Content-Type': 'multipart/form-data' }
      const response = await this.$axios.post('api/room/upload', formData, { headers })
      return response.data.src
    }
  }
}
</script>

<style>
.editor *.is-empty:nth-child(1)::before,
.editor *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

.ProseMirror {
  background-color: white;
    color: black;
    border-radius: 5px;
    padding: 10px;
    min-height: 60px;
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

pre img {
  width: 100%;
}

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
</style>
