<template>
  <v-menu
    v-model="menu"
    :position-x="x"
    :position-y="y"
    absolute
    offset-y
  >
    <v-card
      style="width: 320px"
      @mouseleave="menu = false"
    >
      <template v-for="(emoji) in filterEmoji()">
        <v-btn
          :key="emoji.id"
          outlined
          @click="pushReaction(emoji)"
        >
          {{ emoji.char }}
        </v-btn>
      </template>
    </v-card>
  </v-menu>
</template>

<script>
import Fuse from 'fuse.js'

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
      menu: false,
      filter: ''
    }
  },
  watch: {
    open (newVal) {
      if (this.menu !== newVal) {
        this.menu = newVal
      }
    },
    menu (newVal) {
      if (!newVal) {
        this.$emit('hideMenu')
      }
    }
  },
  methods: {
    filterEmoji () {
      if (!this.filter) {
        return this.emojis.slice(0, 30)
      }
      const fuse = new Fuse(this.emojis, {
        threshold: 0.2,
        keys: ['name', 'keywords']
      })
      const result = fuse.search(this.filter).slice(0, 30)
      return result
    },
    hideMenu () {
      this.$emit('hideMenu')
    },
    pushReaction (emoji) {
      this.$emit('pushReaction', this.message, emoji)
    }
  }
}
</script>
