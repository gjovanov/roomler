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
        <v-list dense>
          <v-list-item-group
            v-model="group"
            color="primary"
          >
            <template
              v-for="(reaction, index) in reactions"
            >
              <v-list-item
                :key="index"
              >
                <v-list-item-avatar size="32">
                  <v-img v-if="getUser(reaction.user).avatar_url" :src="getUser(reaction.user).avatar_url" />
                  <v-icon v-if="!getUser(reaction.user).avatar_url">
                    fa-user
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pl-2">
                  <v-list-item-title v-text="getUser(reaction.user).username" />
                  <v-list-item-action-text />
                </v-list-item-content>
              </v-list-item>
              <v-divider :key="`divider_${index}`" />
            </template>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
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
    reactions: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      group: 0,
      menu: false
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
    getUser (userid) {
      return this.$store.getters['api/auth/getUser'](userid)
    },
    isOnline (userid) {
      return this.$store.getters['api/auth/isOnline'](userid)
    },
    hideMenu () {
      this.$emit('hideMenu')
    }
  }
}
</script>
