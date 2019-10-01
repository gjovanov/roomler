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
          &nbsp;
          <v-avatar
            size="36px"
          >
            <img
              v-if="person && person.photoUrl"
              alt="Avatar"
              :src="person.photoUrl"
            >
            <v-icon
              v-else
            >
              person
            </v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="goToProfile">
          <v-list-item-title>
            Profile
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="goToCreateRoom">
          <v-list-item-title>
            Create new room
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="resetUsername">
          <v-list-item-title>
            Reset username
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="resetPassword">
          <v-list-item-title>
            Reset password
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="logout">
          <v-list-item-title>
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
import {
  handleSuccess
} from '@/services/ajax-handlers'

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
    },
    person () {
      return this.$store.state.auth.person
    }
  },
  // async mounted () {
  //   await this.$store.dispatch('auth/me')
  // },
  methods: {
    goToProfile () {
      this.$router.push({ path: `/@/${this.user.username}` })
    },
    goToCreateRoom () {
      this.$router.push({ path: '/room/create' })
    },
    async resetUsername () {
      await this.$store.dispatch('auth/reset', {
        username: this.$store.state.auth.user.username,
        type: 'username_reset'
      })
      handleSuccess('Username was reset. Please check your email for further instructions.', this.$store.commit)
    },
    async resetPassword () {
      await this.$store.dispatch('auth/reset', {
        username: this.$store.state.auth.user.username,
        type: 'password_reset'
      })
      handleSuccess('Password was reset. Please check your email for further instructions.', this.$store.commit)
    },
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push({ path: '/' })
    }
  }
}
</script>
