<template>
  <editor-menu-bar v-if="!minimal" :id="`${elemId}-format-menu`" v-slot="{ commands, isActive }" :editor="editor">
    <v-container class="pl-0 pr-0 ml-0 mr-0">
      <v-layout class="pl-0 pr-0 ml-0 mr-0 d-flex flex-row flex-wrap justify-center">
        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              tile
              small
              :dark="!isDark"
              :light="isDark"
              elevation="0"
              v-on="on"
              @click="commands.undo"
            >
              <v-icon small>
                fa-undo
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.undo') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              tile
              small
              :dark="!isDark"
              :light="isDark"
              elevation="0"
              v-on="on"
              @click="commands.redo"
            >
              <v-icon small>
                fa-redo
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.redo') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.bold()"
              tile
              small
              :dark="!isDark && !isActive.bold()"
              :light="isDark && !isActive.bold()"
              elevation="0"
              v-on="on"
              @click="commands.bold"
            >
              <v-icon small>
                fa-bold
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.bold') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.italic()"
              tile
              small
              :dark="!isDark && !isActive.italic()"
              :light="isDark && !isActive.italic()"
              elevation="0"
              v-on="on"
              @click="commands.italic"
            >
              <v-icon small>
                fa-italic
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.italic') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.strike()"
              tile
              small
              :dark="!isDark && !isActive.strike()"
              :light="isDark && !isActive.strike()"
              elevation="0"
              v-on="on"
              @click="commands.strike"
            >
              <v-icon small>
                fa-strikethrough
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.strikeThrough') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.underline()"
              tile
              small
              :dark="!isDark && !isActive.underline()"
              :light="isDark && !isActive.underline()"
              elevation="0"
              v-on="on"
              @click="commands.underline"
            >
              <v-icon small>
                fa-underline
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.underline') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.paragraph()"
              tile
              small
              :dark="!isDark && !isActive.paragraph()"
              :light="isDark && !isActive.paragraph()"
              elevation="0"
              v-on="on"
              @click="commands.paragraph"
            >
              <v-icon small>
                fa-paragraph
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.paragraph') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.heading({ level: 1 })"
              tile
              small
              :dark="!isDark && !isActive.heading({ level: 1 })"
              :light="isDark && !isActive.heading({ level: 1 })"
              elevation="0"
              v-on="on"
              @click="commands.heading({ level: 1 })"
            >
              H1
            </v-btn>
          </template>
          <span>{{ $t('comps.chat.heading') }} 1</span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.heading({ level: 2 })"
              tile
              small
              :dark="!isDark && !isActive.heading({ level: 2 })"
              :light="isDark && !isActive.heading({ level: 2 })"
              elevation="0"
              v-on="on"
              @click="commands.heading({ level: 2 })"
            >
              H2
            </v-btn>
          </template>
          <span>{{ $t('comps.chat.heading') }} 2</span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.heading({ level: 3 })"
              tile
              small
              :dark="!isDark && !isActive.heading({ level: 3 })"
              :light="isDark && !isActive.heading({ level: 3 })"
              elevation="0"
              v-on="on"
              @click="commands.heading({ level: 3 })"
            >
              H3
            </v-btn>
          </template>
          <span>{{ $t('comps.chat.heading') }} 3</span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.bullet_list()"
              tile
              small
              :dark="!isDark && !isActive.bullet_list()"
              :light="isDark && !isActive.bullet_list()"
              elevation="0"
              v-on="on"
              @click="commands.bullet_list"
            >
              <v-icon small>
                fa-list-ul
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.bulletList') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.ordered_list()"
              tile
              small
              :dark="!isDark && !isActive.ordered_list()"
              :light="isDark && !isActive.ordered_list()"
              elevation="0"
              v-on="on"
              @click="commands.ordered_list"
            >
              <v-icon small>
                fa-list-ol
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.orderedList') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.todo_list()"
              tile
              small
              :dark="!isDark && !isActive.todo_list()"
              :light="isDark && !isActive.todo_list()"
              elevation="0"
              v-on="on"
              @click="commands.todo_list"
            >
              <v-icon small>
                fa-check-square
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.todoList') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.blockquote()"
              tile
              small
              :dark="!isDark && !isActive.blockquote()"
              :light="isDark && !isActive.blockquote()"
              elevation="0"
              v-on="on"
              @click="commands.blockquote"
            >
              <v-icon small>
                fa-quote-right
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.quote') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.code_block()"
              tile
              small
              :dark="!isDark && !isActive.code_block()"
              :light="isDark && !isActive.code_block()"
              elevation="0"
              v-on="on"
              @click="commands.code_block"
            >
              <v-icon small>
                fa-code
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.code') }}
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :text="isActive.image()"
              tile
              small
              :dark="!isDark && !isActive.image()"
              :light="isDark && !isActive.image()"
              elevation="0"
              v-on="on"
              @click="attach(commands, 'image')"
            >
              <v-icon small>
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
              :text="isActive.file()"
              tile
              small
              :dark="!isDark && !isActive.file()"
              :light="isDark && !isActive.file()"
              elevation="0"
              v-on="on"
              @click="attach(commands, 'file')"
            >
              <v-icon small>
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
              :text="isActive.table()"
              tile
              small
              :dark="!isDark && !isActive.table()"
              :light="isDark && !isActive.table()"
              elevation="0"
              v-on="on"
              @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
            >
              <v-icon small>
                fa-table
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('comps.chat.table') }}
          </span>
        </v-tooltip>

        <template
          v-if="isActive.table()"
        >
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="commands.deleteTable"
              >
                <v-icon small>
                  fa-trash
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.removeTable') }}
            </span>
          </v-tooltip>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="commands.addColumnBefore"
              >
                +|
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.addColumnBefore') }}
            </span>
          </v-tooltip>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="commands.addColumnAfter"
              >
                |+
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.addColumnAfter') }}
            </span>
          </v-tooltip>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="commands.deleteColumn"
              >
                |x|
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.deleteColumn') }}
            </span>
          </v-tooltip>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="commands.addRowBefore"
              >
                +_
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.addRowBefore') }}
            </span>
          </v-tooltip>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="commands.addRowAfter"
              >
                _+
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.addRowAfter') }}
            </span>
          </v-tooltip>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="commands.deleteRow"
              >
                _x_
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.deleteRow') }}
            </span>
          </v-tooltip>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                small
                :dark="!isDark"
                :light="isDark"
                elevation="0"
                v-on="on"
                @click="commands.toggleCellMerge"
              >
                <v-icon small>
                  fa-object-group
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('comps.chat.mergeCells') }}
            </span>
          </v-tooltip>
        </template>
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
    }
  },
  data () {
    return {
      menu: true,
      sub_menu: true
    }
  },
  computed: {
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    attach (comms, attachType) {
      this.$emit('attach', comms, attachType)
    }
  }
}
</script>
