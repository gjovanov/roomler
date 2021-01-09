<template>
  <v-menu
    v-model.lazy="menu"
    :position-x="x"
    :position-y="y"
    :close-on-click="false"
    :close-on-content-click="false"
    open-on-hover
    absolute
    offset-y
  >
    <v-list v-if="message" dense multiple>
      <v-list-item @click="toggleEdit(message)">
        <v-list-item-title>
          <v-icon v-if="!message.edit" x-small>
            fa-edit
          </v-icon>
          <v-icon v-if="message.edit" x-small>
            fa-window-close
          </v-icon>
          <span v-if="!message.edit">
            {{ $t('comps.chat.editMessage') }}
          </span>
          <span v-if="message.edit">
            {{ $t('comps.chat.discardChanges') }}
          </span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="messageDeleteConsent(message)">
        <v-list-item-title>
          <v-icon x-small>
            fa-trash
          </v-icon>
          <span>
            {{ $t('comps.chat.deleteMessage') }}
          </span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="hideMenu(message)">
        <v-list-item-title>
          <v-icon x-small>
            fa-window-close
          </v-icon>
          <span>
            {{ $t('comps.chat.close') }}
          </span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
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
    message: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      menu: false
    }
  },
  computed: {
    isDark () {
      return this.$vuetify.theme.dark
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
        this.$emit('hideMenu', 'message')
      }
    }
  },
  methods: {
    hideMenu () {
      this.$emit('hideMenu', 'message')
    },
    toggleEdit (message) {
      this.$emit('toggleEdit', message)
      this.$emit('hideMenu', 'message')
    },
    messageDeleteConsent (message) {
      this.$emit('messageDeleteConsent', message)
      this.$emit('hideMenu', 'message')
    }
  }
}
</script>
