<template>
  <v-app id="inspire" :style="{background: $vuetify.theme.themes[theme].background}" class="pa-0 ma-0">
    <lazy-left-panel
      v-if="isAuthenticated"
      :drawer="panelLeft"
      :rooms="rooms"
      :tree="tree"
      :peers="peers"
      :user="user"
      :conference-session="conferenceSession"
      :conference-room="conferenceRoom"
      :room-route="roomRoute"
    />
    <lazy-right-panel
      v-if="room && room._id"
      :drawer="panelRight"
      :room="room"
      :peers="peers"
    />
    <v-app-bar
      app
      clipped-left
      clipped-right
      :color="$vuetify.theme.themes[theme].primary"
      dense
      :dark="!isDark"
      :light="isDark"
    >
      <v-app-bar-nav-icon v-if="isAuthenticated" @click.stop="toggle('left')" />
      <logo />
      <v-toolbar-title class="mr-12 align-center">
        <v-btn
          small
          :to="localePath('index')"
          text
          tile
          class="pa-0"
          elevation="0"
        >
          <span class="title">{{ title }}</span>
        </v-btn>
      </v-toolbar-title>
      <div class="flex-grow-1" />

      <auth-panel />
    </v-app-bar>

    <v-main class="pt-9 ma-0">
      <toaster />

      <v-container
        :fill-height="fillHeight"
        :class="areRoomRoutes ? 'pa-0 ma-0' : 'pl-0 pr-0 pt-0 pb-16 ma-0'"
        fluid
      >
        <v-row
          v-show="room"
          justify="center"
          align="stretch"
          align-content="start"
        >
          <v-col class="pb-0">
            <lazy-room-panel
              :rooms="rooms"
              :room="room"
              :peers="peers"
              :user="user"
              :room-route="roomRoute"
              :room-query="roomQuery"
              :conference-session="conferenceSession"
              :conference-room="conferenceRoom"
              :invites="invites"
            />
          </v-col>
        </v-row>
        <v-row
          justify="center"
          align="stretch"
          align-content="start"
        >
          <v-col class="pb-0">
            <nuxt />
          </v-col>
        </v-row>
        <bottom-panel />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import { storage } from '@/services/storage'

export default {

  middleware: 'default-routes',
  data: () => ({
    title: 'Roomler',
    bottomNav: ''
  }),
  computed: {
    areRoomRoutes () {
      return this.$route && this.$route.name && this.$route.name.startsWith('room')
    },
    roomRoute () {
      return this.$route && this.$route.name && this.$route.name.startsWith('room-')
        ? this.$route.name.replace('room-', '')
        : null
    },
    roomQuery () {
      const query = this.roomRoute ? this.$route.query : null
      return query
    },
    fillHeight () {
      return this.$route.name && this.$route.name.startsWith('--')
      // return !this.areRoomRoutes && ['index'].includes(this.$route.name) && !['explore-rooms'].includes(this.$route.name)
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
    peers () {
      const result = this.$store.getters['api/auth/getPeers']
      return result
    },
    rooms () {
      return this.$store.state.api.room.rooms
    },
    room () {
      return this.$store.state.api.room.room
    },
    conferenceSession () {
      return this.$store.state.api.conference.session
    },
    conferenceRoom () {
      return this.$store.state.api.conference.room
    },
    tree () {
      return this.$store.state.api.room.tree
    },
    invites () {
      return this.$store.state.api.invite.invites
    },
    panelLeft () {
      return this.$store.state.panel.left
    },
    panelRight () {
      return this.$store.state.panel.right
    },
    isDark () {
      return this.$vuetify.theme.dark
    },
    theme () {
      return this.$vuetify.theme.isDark ? 'dark' : 'light'
    }
  },
  created () {
    const theme = storage.getLocal('theme')
    this.$vuetify.theme.dark = theme === 'dark'
  },
  methods: {
    toggle (panel) {
      this.$store.commit('panel/toggle', panel)
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  width: 7px;
}
::-webkit-scrollbar-track {
  background: white;
}
::-webkit-scrollbar-thumb {
  background-color: black ;
  border-radius: 3px;
  border: 1px solid white;
}
.v-toolbar__content {
  padding-right: 0px !important;
}
.iframe_embed {
  max-width: 100%;
  width: 30rem;
  height: 15rem;
  border: 0;
}
</style>
