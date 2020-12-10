<template>
  <client-only>
    <v-toolbar-items>
      <v-btn
        v-if="!isAuthenticated"
        color="secondary"
        rounded
        :to="localePath({ name: '--auth-register' })"
        style="border-radius: 28px;"
      >
        {{ $t('comps.auth.signup') }}
      </v-btn>

      <v-divider v-if="!isAuthenticated" vertical />

      <v-btn
        v-if="!isAuthenticated"
        text
        :to="localePath({ name: '--auth-login' })"
      >
        {{ $t('comps.auth.login') }}
      </v-btn>

      <v-divider vertical />

      <v-menu
        v-if="totalUnreads"
        v-model="messagesMenu"
        open-on-hover
        bottom
        offset-y
      >
        <template #activator="{ on }">
          <v-btn
            outlined
            small
            dark
            style="background-color: #303030"
            v-on="on"
          >
            <v-badge
              :color="totalMentions ? 'red' : 'orange'"
              left
              bottom
              overlap
            >
              <template #badge>
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
              <v-list-item-icon>
                <v-badge
                  :color="item.mentions ? 'red' : 'orange'"
                  left
                  bottom
                  overlap
                >
                  <template #badge>
                    {{ item.unreads }}
                  </template>
                  <v-icon>mdi-email</v-icon>
                </v-badge>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <span>{{ item.room.path }}</span>
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
            <v-divider :key="`message_divider_${index}`" />
          </template>
        </v-list>
      </v-menu>

      <v-menu
        v-if="Object.keys(calls).length"
        v-model="callsMenu"
        open-on-hover
        bottom
        offset-y
      >
        <template #activator="{ on }">
          <v-btn
            outlined
            small
            dark
            style="background-color: #303030"
            v-on="on"
          >
            <v-badge
              color="red"
              left
              bottom
              overlap
            >
              <template #badge>
                {{ Object.keys(calls).length }}
              </template>
              <v-icon>fa fa-phone</v-icon>
            </v-badge>
          </v-btn>
        </template>

        <v-list>
          <template v-for="(value, propName, index) in calls">
            <v-list-item
              :key="propName"
              @click="goToRoomCalls(getRoom(propName))"
            >
              <v-list-item-icon>
                <v-badge
                  color="red"
                  left
                  bottom
                  overlap
                >
                  <template #badge>
                    {{ value.length }}
                  </template>
                  <v-icon>fa fa-phone</v-icon>
                </v-badge>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <span>{{ getRoom(propName) ? getRoom(propName).path : '' }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="`call_divider_${index}`" />
          </template>
        </v-list>
      </v-menu>

      <v-menu
        v-model="langMenu"
        open-on-hover
        bottom
        offset-y
      >
        <template #activator="{ on }">
          <v-btn
            text
            right
            depressed
            v-on="on"
          >
            <v-icon>fa fa-globe</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="locale in $i18n.locales"
            :key="locale.code"
            :disabled="locale.code === $i18n.locale"
            @click.prevent.stop="$i18n.setLocale(locale.code)"
          >
            <v-list-item-title class="justify-center align-center">
              <v-chip :color="locale.code === $i18n.locale ? 'primary' : undefined">
                <v-img :src="`/country/${locale.code}.png`" width="32" left /> &nbsp; {{ $t(`lang.${locale.code}`) }}
              </v-chip>
            </v-list-item-title>
          </v-list-item>
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
        <template #activator="{ on }">
          <v-btn
            text
            right
            depressed
            style="min-width: 255px"
            class="pl-0"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
            {{ user.username }}
          &nbsp;
            <v-badge
              id="auth-status"
              :color="isInCall() ? 'red' : isOnline() ? 'green' : 'grey'"
              :dark="isInCall() ? true : undefined"
              bordered
              bottom
              left
              avatar
              overlap
              offset-x="10"
              offset-y="10"
            >
              <template v-if="isInCall()" #badge>
                <v-avatar v-if="isInCall()" size="6">
                  <v-icon size="7" style="margin-bottom: 6px">
                    fa fa-phone
                  </v-icon>
                </v-avatar>
              </template>
              <v-avatar
                size="36px"
              >
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  alt="Avatar"
                >
                <v-icon
                  v-else
                >
                  fa-user
                </v-icon>
              </v-avatar>
            </v-badge>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="goToProfile">
            <v-list-item-title>
              <v-icon>fa-user</v-icon> {{ $t('comps.auth.profile') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="toggleTheme">
            <v-list-item-title>
              <v-switch v-model="toggle" :label="$t('comps.auth.toggleDarkMode')" />
            </v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item v-if="permission !== 'N/A'" @click="toggleSubscribe">
            <v-list-item-title>
              <v-icon>{{ subscribeIcon }}</v-icon> {{ subscribeTitle }}
            </v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="goToCreateRoom">
            <v-list-item-title>
              <v-icon>fa-plus</v-icon> {{ $t('comps.auth.createNewRoom') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="goToExplore">
            <v-list-item-title>
              <v-icon>fa-search</v-icon> {{ $t('comps.auth.exploreRooms') }}
            </v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="resetUsername">
            <v-list-item-title>
              <v-icon>fa-fingerprint</v-icon> {{ $t('comps.auth.resetUsername') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="resetPassword">
            <v-list-item-title>
              <v-icon>fa-key</v-icon> {{ $t('comps.auth.resetPassword') }}
            </v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item v-if="isAdmin" @click="goToVisits">
            <v-list-item-title>
              <v-icon>fa-eye</v-icon> {{ $t('comps.auth.visits') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAdmin" @click="goToStats">
            <v-list-item-title>
              <v-icon>fa-chart-line</v-icon> {{ $t('comps.auth.stats') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon>fa-power-off</v-icon> {{ $t('comps.auth.logout') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-divider v-if="user && isAuthenticated && !isActivated" vertical />

      <v-btn v-if="user && isAuthenticated && !isActivated" text @click="resetAccount()">
        {{ $t('comps.auth.activate') }}
      </v-btn>
    </v-toolbar-items>
  </client-only>
</template>

<script>
import {
  handleSuccess
} from '@/services/ajax-handlers'
// import { colorUtils } from '@/utils/color-utils'
import { storage } from '@/services/storage'
import { base64Utils } from '@/utils/base64-utils'

export default {
  data () {
    return {
      subscription: null,
      toggle: true,
      langMenu: false,
      profileMenu: false,
      messagesMenu: false,
      callsMenu: false
    }
  },
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    },
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
    isAdmin () {
      return this.$store.state.api.auth.isAdmin
    },
    rooms () {
      return this.$store.state.api.room.rooms
    },
    calls () {
      return this.$store.getters['api/room/calls/callsByRoom']
    },
    isDark () {
      return this.$vuetify.theme.dark
    },
    theme () {
      return this.$vuetify.theme.isDark ? 'dark' : 'light'
    },
    messageNotifications () {
      const self = this
      let result = []
      if (this.user) {
        result = this.rooms
          .map((room) => {
            return {
              room,
              unreads: room && room._id ? self.$store.getters['api/message/unreads'](room._id).length : 0,
              mentions: room && room._id ? self.$store.getters['api/message/mentions'](room._id, self.user._id).length : 0
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
    },
    permission () {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        return Notification.permission
      }
      return 'N/A'
    },
    subscribeIcon () {
      return !this.subscription ? 'fa-bell' : 'fa-bell-slash'
    },
    subscribeTitle () {
      if (this.subscription) {
        return this.$t('comps.auth.notificationsStop')
      }
      if (this.permission === 'denied') {
        return this.$t('comps.auth.notificationsBlocked')
      } else {
        return this.$t('comps.auth.notificationsStart')
      }
    }
  },
  async mounted () {
    const sw = await navigator.serviceWorker.ready
    this.subscription = await sw.pushManager.getSubscription()
  },
  methods: {
    isOnline () {
      return this.$store.getters['api/auth/isOnline'](this.$store.state.api.auth.user._id)
    },
    isInCall () {
      return this.$store.getters['api/room/calls/isUserInCall'](this.$store.state.api.auth.user._id)
    },
    getRoom (id) {
      return this.$store.getters['api/room/getRoom'](id)
    },
    getUser (id) {
      return this.$store.getters['api/auth/getUser'](id)
    },
    goToProfile () {
      this.$router.push({ path: this.localePath({ name: '--username', params: { username: `${this.user.username}` } }) })
    },
    toggleTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      storage.setLocal('theme', this.theme)
    },
    goToRoom (room) {
      this.$router.push({ path: this.localePath({ name: 'room-chat', params: { room } }) })
    },
    goToRoomCalls (room) {
      if (room && room.path) {
        this.$router.push({ path: this.localePath({ name: 'room-calls', params: { room: `${room.path}` } }) })
      }
    },
    goToCreateRoom () {
      this.$router.push({ path: this.localePath({ name: '--room-create' }) })
    },
    goToExplore () {
      this.$router.push({ path: this.localePath({ name: 'explore-rooms' }) })
    },
    async resetAccount () {
      await this.$store.dispatch('api/auth/reset', {
        email: this.$store.state.api.auth.user.email,
        type: 'user_activation'
      })
      handleSuccess(this.$t('comps.auth.activationMessage'), this.$store.commit)
    },
    async resetUsername () {
      await this.$store.dispatch('api/auth/reset', {
        email: this.$store.state.api.auth.user.email,
        type: 'username_reset'
      })
      handleSuccess(this.$t('comps.auth.usernameResetMessage'), this.$store.commit)
    },
    async resetPassword () {
      await this.$store.dispatch('api/auth/reset', {
        email: this.$store.state.api.auth.user.email,
        type: 'password_reset'
      })
      handleSuccess(this.$t('comps.auth.passwordResetMessage'), this.$store.commit)
    },
    async goToVisits () {
      await this.$router.push({ path: this.localePath({ name: 'admin-stats', query: { status: 'open', panel: 3, type: 'chart' } }) })
    },
    async goToStats () {
      await this.$router.push({ path: this.localePath({ name: 'admin-stats', query: { panel: 3, type: 'chart' } }) })
    },
    async logout () {
      await this.$router.push({ path: this.localePath({ name: 'index' }) })
      await this.$store.dispatch('api/auth/logout')
      await this.$store.dispatch('connectWebSocket')
    },
    async toggleSubscribe () {
      if ('Notification' in window) {
        if (Notification.permission !== 'denied') {
          if (!this.subscription) {
            const result = await Notification.requestPermission()
            if (result === 'denied') {
              alert(this.$t('comps.auth.notificationsBlockedMessage'))
              return
            }
            if (!('serviceWorker' in navigator)) {
              return
            }
            const sw = await navigator.serviceWorker.ready
            const sub = await sw.pushManager.getSubscription()
            if (sub === null) {
              const config = this.$store.state.api.config.config
              this.subscription = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: base64Utils.urlB64ToUint8Array(config.webPushSettings.publicKey)
              })
              await this.$store.dispatch('api/subscription/create', this.subscription.toJSON(), { root: true })
            }
            // eslint-disable-next-line no-new
            new Notification(this.$t('comps.auth.subscribedMessage'))
          } else {
            const sw = await navigator.serviceWorker.ready
            const sub = await sw.pushManager.getSubscription()
            if (sub !== null) {
              const payload = sub.toJSON()
              const success = await sub.unsubscribe()
              if (success) {
                await this.$store.dispatch('api/subscription/delete', payload, { root: true })
                this.subscription = null
              }
            }
            // eslint-disable-next-line no-new
            new Notification(this.$t('comps.auth.unsubscribedMessage'))
          }
        } else {
          alert(this.$t('comps.auth.notificationsBlockedMessage'))
        }
      } else {
        alert(this.$t('comps.auth.notificationsNotSupportedMessage'))
      }
    }
  }
}
</script>
<style scoped>
#auth-status >>> .v-badge__badge {
    height: 12px;
    min-width: 12px;
    padding: 0px;
  }
  #auth-status >>> #auth-status.v-badge--bordered .v-badge__badge::after {
    border-width: 1px;
  }
</style>
