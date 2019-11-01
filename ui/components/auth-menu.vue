<template>
  <v-toolbar-items>
    <v-btn v-if="!isAuthenticated" text to="/@/auth/register">
      Register
    </v-btn>

    <v-divider vertical />

    <v-btn v-if="!isAuthenticated" text to="/@/auth/login">
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
              v-if="avatarUrl"
              alt="Avatar"
              :src="avatarUrl"
            >
            <v-icon
              v-else
            >
              fa-user
            </v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="goToProfile">
          <v-list-item-title>
            <v-icon>fa-user</v-icon> Profile
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="goToCreateRoom">
          <v-list-item-title>
            <v-icon>fa-comment</v-icon> Create new room
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="resetUsername">
          <v-list-item-title>
            <v-icon>fa-fingerprint</v-icon> Reset username
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="resetPassword">
          <v-list-item-title>
            <v-icon>fa-key</v-icon> Reset password
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="logout">
          <v-list-item-title>
            <v-icon>fa-power-off</v-icon> Log out
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-divider vertical />

    <v-btn v-if="user && isAuthenticated && !isActivated" text @click="resetAccount()">
      Activate
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
      return this.$store.getters['api/auth/isAuthenticated']
    },
    isActivated () {
      return this.$store.getters['api/auth/isActivated']
    },
    avatarUrl () {
      return this.$store.getters['api/auth/avatarUrl']
    },
    user () {
      return this.$store.state.api.auth.user
    }
  },
  methods: {
    goToProfile () {
      this.$router.push({ path: `/@/${this.user.username}` })
    },
    goToCreateRoom () {
      this.$router.push({ path: '/@/room/create' })
    },
    async resetAccount () {
      await this.$store.dispatch('api/auth/reset', {
        email: this.$store.state.api.auth.user.email,
        type: 'user_activation'
      })
      handleSuccess('Activation link was send. Please check your email for further instructions.', this.$store.commit)
    },
    async resetUsername () {
      await this.$store.dispatch('api/auth/reset', {
        email: this.$store.state.api.auth.user.email,
        type: 'username_reset'
      })
      handleSuccess('Username was reset. Please check your email for further instructions.', this.$store.commit)
    },
    async resetPassword () {
      await this.$store.dispatch('api/auth/reset', {
        email: this.$store.state.api.auth.user.email,
        type: 'password_reset'
      })
      handleSuccess('Password was reset. Please check your email for further instructions.', this.$store.commit)
    },
    async logout () {
      await this.$router.push({ path: '/' })
      await this.$store.dispatch('api/auth/logout')
      await this.$store.dispatch('connectWebSocket')
    }
  }
}
</script>
