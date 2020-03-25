<template>
  <v-app id="inspire">
    <left-panel
      v-if="isAuthenticated"
      :drawer="panelLeft"
      :rooms="rooms"
      :tree="tree"
      :peers="peers"
      :user="user"
      :session="session"
      :conference-room="conferenceRoom"
    />
    <right-panel
      v-if="room && room._id"
      :drawer="panelRight"
      :room="room"
      :peers="peers"
      :room-peers="roomPeers"
    />
    <v-app-bar
      app
      clipped-left
      clipped-right
      color="red"
      dense
    >
      <v-app-bar-nav-icon v-if="isAuthenticated" @click.stop="toggle('left')" />
      <logo />
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">{{ title }}</span>
      </v-toolbar-title>
      <div class="flex-grow-1" />

      <auth-panel />
    </v-app-bar>

    <v-content class="pt-9 ma-0">
      <v-container
        :fill-height="fillHeight"
        class="pa-0 ma-0"
        fluid
      >
        <v-row
          justify="center"
          align="stretch"
          align-content="start"
        >
          <v-col>
            <nuxt />
          </v-col>
        </v-row>
        <bottom-panel />
      </v-container>
      <toaster />
    </v-content>
  </v-app>
</template>

<script>

import Logo from '@/components/logo'
import AuthPanel from '@/components/auth-panel'
import LeftPanel from '@/components/left-panel'
import RightPanel from '@/components/right-panel'
// import RoomPanel from '@/components/room-panel'
import BottomPanel from '@/components/bottom-panel'
import Toaster from '@/components/toaster'

export default {
  middleware: 'default-routes',
  components: {
    Logo,
    AuthPanel,
    LeftPanel,
    RightPanel,
    // RoomPanel,
    BottomPanel,
    Toaster
  },
  data: () => ({
    title: 'Roomler',
    bottomNav: ''
  }),
  computed: {
    areRoomRoutes () {
      return this.$route.name.startsWith('room')
    },
    isRoomRoute () {
      return this.$route.name === 'room'
    },
    fillHeight () {
      return !this.areRoomRoutes
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
      return this.$store.state.api.room.room
    },
    session () {
      return this.$store.state.api.conference.session
    },
    conferenceRoom () {
      return this.$store.state.api.conference.room
    },
    conferencePosition () {
      return this.$store.state.api.conference.position
    },
    tree () {
      return this.$store.state.api.room.tree
    },
    peers () {
      return this.$store.getters['api/auth/getPeers']
    },
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    },
    panelLeft () {
      return this.$store.state.panel.left
    },
    panelRight () {
      return this.$store.state.panel.right
    }
  },
  watch: {
    $route (to, from) {
      if (to.params.room) {
        this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](to.params.room), { root: true })
      }
    }
  },
  created () {
    this.$vuetify.theme.dark = true
    if (this.$route.params.room) {
      this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](this.$route.params.room), { root: true })
    }
  },
  methods: {
    toggle (panel) {
      this.$store.commit('panel/toggle', panel)
    }
  }
}
</script>
