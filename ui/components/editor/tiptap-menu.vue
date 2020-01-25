<template>
  <editor-menu-bar v-if="!minimal" v-slot="{ commands, isActive }" :editor="editor">
    <v-container>
      <v-layout class="justify-center">
        <v-btn-toggle
          v-model="menu"
          rounded
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.undo"
                x-small
              >
                <v-icon small>
                  fa-undo
                </v-icon>
              </v-btn>
            </template>
            <span>Undo</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.redo"
                x-small
              >
                <v-icon small>
                  fa-redo
                </v-icon>
              </v-btn>
            </template>
            <span>Redo</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.bold()"
                v-on="on"
                @click="commands.bold"
                x-small
              >
                <v-icon small>
                  fa-bold
                </v-icon>
              </v-btn>
            </template>
            <span>Bold</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.italic()"
                v-on="on"
                @click="commands.italic"
                x-small
              >
                <v-icon small>
                  fa-italic
                </v-icon>
              </v-btn>
            </template>
            <span>Italic</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.strike()"
                v-on="on"
                @click="commands.strike"
                x-small
              >
                <v-icon small>
                  fa-strikethrough
                </v-icon>
              </v-btn>
            </template>
            <span>Strike-through</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.underline()"
                v-on="on"
                @click="commands.underline"
                x-small
              >
                <v-icon small>
                  fa-underline
                </v-icon>
              </v-btn>
            </template>
            <span>Underline</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-layout>
      <v-layout class="justify-center">
        <v-btn-toggle
          v-model="menu"
          rounded
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.paragraph()"
                v-on="on"
                @click="commands.paragraph"
                x-small
              >
                <v-icon small>
                  fa-paragraph
                </v-icon>
              </v-btn>
            </template>
            <span>Paragraph</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.heading({ level: 1 })"
                v-on="on"
                @click="commands.heading({ level: 1 })"
                x-small
              >
                H1
              </v-btn>
            </template>
            <span>Heading 1</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.heading({ level: 2 })"
                v-on="on"
                @click="commands.heading({ level: 2 })"
                x-small
              >
                H2
              </v-btn>
            </template>
            <span>Heading 2</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.heading({ level: 3 })"
                v-on="on"
                @click="commands.heading({ level: 3 })"
                x-small
              >
                H3
              </v-btn>
            </template>
            <span>Heading 3</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.bullet_list()"
                v-on="on"
                @click="commands.bullet_list"
                x-small
              >
                <v-icon small>
                  fa-list-ul
                </v-icon>
              </v-btn>
            </template>
            <span>Bullet list</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.ordered_list()"
                v-on="on"
                @click="commands.ordered_list"
                x-small
              >
                <v-icon small>
                  fa-list-ol
                </v-icon>
              </v-btn>
            </template>
            <span>Ordered list</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-layout>
      <v-layout class="justify-center">
        <v-btn-toggle
          v-model="menu"
          rounded
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.todo_list()"
                v-on="on"
                @click="commands.todo_list"
                x-small
              >
                <v-icon small>
                  fa-check-square
                </v-icon>
              </v-btn>
            </template>
            <span>Todo</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.blockquote()"
                v-on="on"
                @click="commands.blockquote"
                x-small
              >
                <v-icon small>
                  fa-quote-right
                </v-icon>
              </v-btn>
            </template>
            <span>Quote</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.code_block()"
                v-on="on"
                @click="commands.code_block"
                x-small
              >
                <v-icon small>
                  fa-code
                </v-icon>
              </v-btn>
            </template>
            <span>Code</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.image()"
                v-on="on"
                @click="showImagePrompt(commands.image)"
                x-small
              >
                <v-icon small>
                  fa-image
                </v-icon>
              </v-btn>
            </template>
            <span>Image</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :text="isActive.table()"
                v-on="on"
                @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
                x-small
              >
                <v-icon small>
                  fa-table
                </v-icon>
              </v-btn>
            </template>
            <span>Table</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-layout>
      <v-layout class="justify-center">
        <v-btn-toggle
          v-if="isActive.table()"
          v-model="sub_menu"
          rounded
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.deleteTable"
                x-small
              >
                <v-icon small>
                  fa-trash
                </v-icon>
              </v-btn>
            </template>
            <span>Remove table</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.addColumnBefore"
                x-small
              >
                +|
              </v-btn>
            </template>
            <span>Add column before</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.addColumnAfter"
                x-small
              >
                |+
              </v-btn>
            </template>
            <span>Add column after</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.deleteColumn"
                x-small
              >
                |x|
              </v-btn>
            </template>
            <span>Delete column</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.addRowBefore"
                x-small
              >
                +_
              </v-btn>
            </template>
            <span>Add row before</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.addRowAfter"
                x-small
              >
                _+
              </v-btn>
            </template>
            <span>Add row after</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.deleteRow"
                x-small
              >
                _x_
              </v-btn>
            </template>
            <span>Delete row</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="commands.toggleCellMerge"
                x-small
              >
                <v-icon small>
                  fa-object-group
                </v-icon>
              </v-btn>
            </template>
            <span>Merge cells</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-layout>
    </v-container>
  </editor-menu-bar>
</template>

<script>
import { EditorMenuBar } from 'tiptap'

export default {
  components: {
    EditorMenuBar
  },
  props: {
    editor: {
      type: Object,
      default: null
    },
    minimal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      menu: true,
      sub_menu: true
    }
  },
  methods: {
    showImagePrompt (command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
    }
  }
}
</script>
