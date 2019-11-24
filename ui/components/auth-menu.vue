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
      v-if="totalUnreads"
      v-model="notificationsMenu"
      open-on-hover
      bottom
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          outlined
          small
          style="background-color: #303030"
          v-on="on"
        >
          <v-badge
            left
            bottom
            overlap
            :color="totalMentions ? 'red' : 'orange'"
          >
            <template v-slot:badge>
              {{ totalUnreads }}
            </template>
            <v-icon>mdi-email</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list>
        <template v-for="(item, index) in messageNotifications">
          <v-list-item
            :key="item.room.path"
            @click="goToRoom(item.room.path)"
          >
            <v-list-item-avatar>
              <v-badge
                left
                bottom
                overlap
                :color="item.mentions ? 'red' : 'orange'"
              >
                <template v-slot:badge>
                  {{ item.unreads }}
                </template>
                <v-icon>mdi-email</v-icon>
              </v-badge>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ item.room.short_name }}</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="item.mentions">
              <v-list-item-action-text>
                <v-icon small color="red">
                  fa-at
                </v-icon>
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`menu_divider_${index}`" />
        </template>
      </v-list>
    </v-menu>

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
      profileMenu: false,
      notificationsMenu: false
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
    },
    rooms () {
      return this.$store.state.api.room.rooms
    },
    messageNotifications () {
      const self = this
      let result = []
      if (this.user) {
        result = this.rooms
          .map((room) => {
            return {
              room,
              unreads: self.$store.getters['api/message/unreads'](room.path).length,
              mentions: self.$store.getters['api/message/mentions'](room.path, self.user._id).length
            }
          })
          .filter(r => r.unreads > 0)
      }
      return result
    },
    totalUnreads () {
      const result = this.messageNotifications.reduce((a, b) => a + b.unreads, 0)
      return result
    },
    totalMentions () {
      return this.messageNotifications.reduce((a, b) => a + b.mentions, 0)
    }
  },
  methods: {
    goToProfile () {
      this.$router.push({ path: `/@/${this.user.username}` })
    },
    goToRoom (room) {
      this.$router.push({ path: `/${room}` })
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
