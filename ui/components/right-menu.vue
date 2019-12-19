<template>
  <client-only>
    <v-navigation-drawer
      v-model="rightDrawer"
      app
      clipped
      right
      expand-on-hover
      :mini-variant.sync="mini"
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>fa-users</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>Members</v-list-item-title>
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
          v-for="user in members"
          :key="user._id"
          :href="`/@/${user.username}`"
          link
        >
          <v-list-item-icon>
            <v-avatar
              size="36px"
            >
              <img v-if="user.avatar_url" :src="user.avatar_url">
              <v-icon v-if="!user.avatar_url">
                fa-user
              </v-icon>
            </v-avatar>
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
    }
  },
  data () {
    return {
      rightDrawer: false,
      mini: true
    }
  },
  computed: {
    members () {
      const users = this.room ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
      return users
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
  }
}
</script>
