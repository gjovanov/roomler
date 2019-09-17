<template>
  <v-toolbar-items>
    <v-btn v-if="!isAuthenticated" text to="/auth/register">
      Register
    </v-btn>

    <v-divider vertical />

    <v-btn v-if="!isAuthenticated" text to="/auth/login">
      Login
    </v-btn>

    <v-divider vertical />

    <v-menu
      v-if="isAuthenticated"
      v-model="profileMenu"
      open-on-hover
      bottom
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          text
          dark
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
          {{ user.username }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title @click="logout">
            Log out
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-divider vertical />

    <v-btn v-if="user && isAuthenticated && !isActivated" text :to="`/auth/reset?user=${ user.username }`">
      Reset
    </v-btn>
  </v-toolbar-items>
</template>

<script>
export default {
  data () {
    return {
      profileMenu: false
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    isActivated () {
      return this.$store.getters['auth/isActivated']
    },
    user () {
      return this.$store.state.auth.user
    }
  },
  // async mounted () {
  //   await this.$store.dispatch('auth/me')
  // },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
