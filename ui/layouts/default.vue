<template>
  <v-app id="inspire">
    <left-menu v-if="isAuthenticated" :drawer="leftMenu" :rooms="rooms" @toggleDrawer="toggleDrawer" />
    <right-menu v-if="room && room._id" :drawer="menuMembers" :room="room" />
    <v-app-bar
      app
      clipped-left
      clipped-right
      color="red"
      dense
    >
      <v-app-bar-nav-icon v-if="isAuthenticated" @click.stop="leftMenu = !leftMenu" />
      <logo />
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">{{ title }}</span>
      </v-toolbar-title>
      <div class="flex-grow-1" />

      <auth-menu />
    </v-app-bar>

    <v-content class="pt-9 ma-0">
      <v-container
        :fill-height="fillHeight"
        class="pt-0 mt-0 pb-0 mb-0"
        fluid
      >
        <v-row
          justify="center"
          align="stretch"
          align-content="start"
          class="pt-0 mt-0"
        >
          <v-col>
            <nuxt />
          </v-col>
        </v-row>
        <v-footer
          padless
          absolute
        >
          <v-btn
            text
            to="/tos/privacy"
          >
            Privacy terms
          </v-btn>
        </v-footer>
      </v-container>
      <toaster />
    </v-content>
  </v-app>
</template>

<script>

import Logo from '@/components/logo'
import AuthMenu from '@/components/auth-menu'
import LeftMenu from '@/components/left-menu'
import RightMenu from '@/components/right-menu'
import Toaster from '@/components/toaster'

export default {
  middleware: 'default-routes',
  components: {
    Logo,
    AuthMenu,
    LeftMenu,
    RightMenu,
    Toaster
  },
  data: () => ({
    title: 'Roomler',
    leftMenu: true
  }),
  computed: {
    fillHeight () {
      return !this.$route.name.startsWith('roomname')
    },

    isAuthenticated () {
      return this.$store.getters['api/auth/isAuthenticated']
    },
    isActivated () {
      return this.$store.getters['api/auth/isActivated']
    },
    user () {
      return this.$store.state.api.auth.user
    },
    rooms () {
      return this.$store.state.api.room.rooms
    },
    room () {
      return this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname)
    },
    menuMembers () {
      return this.$store.state.api.auth.menu.members
    }
  },
  created () {
    this.$vuetify.theme.dark = true
  },
  methods: {
    toggleDrawer (value) {
      this.leftMenu = value
    }
  }
}
</script>
