<template>
  <v-app id="inspire">
    <left-menu v-if="isAuthenticated" :drawer="leftMenu" />
    <v-app-bar
      app
      clipped-left
      color="red"
      dense
    >
      <v-app-bar-nav-icon v-if="isAuthenticated" @click.stop="leftMenu = !leftMenu" />
      <v-icon class="mx-4">
        fab fa-youtube
      </v-icon>
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

import config from '@@/config'
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
    title: config.appSettings.name,
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
    }
  },
  created () {
    this.$vuetify.theme.dark = true
  }
}
</script>
