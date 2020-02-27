<template>
  <client-only>
    <v-navigation-drawer
      v-model="rightDrawer"
      :mini-variant.sync="mini"
      app
      clipped
      right
      expand-on-hover
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>fa-users</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>ROOM PEERS</v-list-item-title>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider />
      <v-list dense>
        <v-list-item
          v-for="user in peers"
          :key="user._id"
          :href="`/@/${user.username}`"
          link
        >
          <v-list-item-icon>
            <v-badge
              :color="isOnline(user._id) ? 'green' : 'grey'"
              bordered
              bottom
              left
              dot
              offset-x="4"
              offset-y="4"
            >
              <v-avatar
                size="36px"
              >
                <img v-if="user.avatar_url" :src="user.avatar_url">
                <v-icon v-if="!user.avatar_url">
                  fa-user
                </v-icon>
              </v-avatar>
            </v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ user.username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </client-only>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    room: {
      type: Object,
      default () {
        return null
      }
    },
    peers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      rightDrawer: true,
      mini: true
    }
  },
  watch: {
    drawer (value) {
      this.rightDrawer = value
    },
    rightDrawer (value) {
      if (value !== this.drawer) {
        this.$store.commit('api/auth/toggleMenu', 'members')
      }
    }
  },
  methods: {
    isOnline (userid) {
      return this.$store.getters['api/auth/isOnline'](userid)
    }
  }
}
</script>
