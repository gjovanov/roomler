<template>
  <v-menu
    v-model.lazy="menu"
    :position-x="x"
    :position-y="y"
    :close-on-click="false"
    :close-on-content-click="false"
    absolute
    offset-y
  >
    <v-card
      style="width: 384px;"
      @mouseleave="menu = false"
    >
      <v-card-title class="overline primary">
        <v-btn
          small
          text
          right
          absolute
          elevation="0"
          @click="hideMenu()"
        >
          <v-icon>fa-window-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pr-0 pl-0 pb-0 pt-1">
        <v-form>
          <v-text-field
            ref="emoji-filter"
            v-model="filter"
            :label="$t('comps.room.searchEmoji')"
            name="filter"
            single-line
            autofocus
            outlined
            dense
            persistent-hint
            clearable
            autocomplete="on"
            :hint="$t('comps.room.emojiHint')"
          />
          <v-sheet>
            <v-tabs
              v-if="!filter"
              v-model.lazy="tab"
              show-arrows
              centered
              icons-and-text
            >
              <v-tabs-slider color="teal lighten-3" />
              <v-tab
                v-for="category in categories"
                :key="category.code"
              >
                {{ category.name }}
                <v-icon
                  small
                >
                  {{ category.icon }}
                </v-icon>
              </v-tab>
            </v-tabs>
          </v-sheet>
          <v-pagination
            v-model="page"
            :length="length"
          />
          <v-sheet class="justify-center">
            <template v-for="(emoji) in filteredEmojis">
              <v-btn
                :key="emoji.id"
                tile
                elevation="0"
                @click="addEmoji(emoji)"
              >
                {{ emoji.char }}
              </v-btn>
            </template>
          </v-sheet>
        </v-form>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import Fuse from 'fuse.js'

import { frequent } from '@/components/emoji/emoji-frequent'
import { categories } from '@/components/emoji/emoji-categories'

export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    emojis: {
      type: Array,
      default: null
    },
    message: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      tab: 0,
      page: 1,
      length: 1,
      pageSize: 18,
      menu: false,
      filter: '',
      categories
    }
  },
  computed: {
    searchableEmojis () {
      if (!this.filter) {
        return (this.tab === 0 ? [...new Set(this.emojis.filter(item => frequent.includes(item.name)))] : this.emojis.filter(item => item.category === categories[this.tab].code))
      } else {
        return this.emojis
      }
    },
    filteredEmojis () {
      if (!this.filter) {
        const result = this.searchableEmojis.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
        return result
      } else {
        const fuse = new Fuse(this.searchableEmojis, {
          threshold: 0.2,
          keys: ['name', 'keywords']
        })
        const result = fuse.search(this.filter).map(i => i.item).slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
        return result
      }
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  watch: {
    open (newVal) {
      const self = this
      if (this.menu !== newVal) {
        this.menu = newVal
      }
      this.filter = null
      this.page = 1
      this.tab = 0
      this.$nextTick(() => {
        setTimeout(() => {
          const emojiFilter = self.$refs['emoji-filter']
          if (emojiFilter) {
            emojiFilter.focus()
          }
        }, 400)
      })
    },
    menu (newVal) {
      if (!newVal) {
        this.$emit('hideMenu', 'addEmoji')
      }
    },
    tab (newVal) {
      this.page = 1
    },
    searchableEmojis (newVal) {
      this.page = 1
      this.length = Math.ceil(1.0 * newVal.length / this.pageSize)
    }
  },
  methods: {
    hideMenu () {
      this.$emit('hideMenu', 'addEmoji')
    },
    addEmoji (emoji) {
      this.$emit('addEmoji', emoji)
      this.$emit('hideMenu', 'addEmoji')
    }
  }
}
</script>
<style scoped>
  * >>> .v-pagination__item{
    display: none;
  }
  * >>> .v-pagination__more{
    display: none;
  }
</style>
