<template>
  <v-app id="inspire">
    <left-menu v-if="isAuthenticated" :drawer="leftMenu" :rooms="rooms" />
    <v-app-bar
      app
      clipped-left
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

    <v-content>
      <v-container class="fill-height">
        <v-row
          justify="center"
          align="center"
        >
          <v-col>
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
      <toaster />
    </v-content>
  </v-app>
</template>

<script>

import Logo from '@/components/logo'
import AuthMenu from '@/components/auth-menu'
import LeftMenu from '@/components/left-menu'
import Toaster from '@/components/toaster'

export default {
  components: {
    Logo,
    AuthMenu,
    LeftMenu,
    Toaster
  },
  data: () => ({
    title: 'Roomler',
    leftMenu: true
  }),
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
    rooms () {
      return this.$store.state.room.rooms
    }
  },
  async mounted () {

  },
  async created () {
    this.$vuetify.theme.dark = true
    if (this.isAuthenticated) {
      await this.$store.dispatch('room/getAll')
    }
  }
}
</script>
