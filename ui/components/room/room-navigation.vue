<template>
  <v-toolbar
    v-if="room && roomRoute"
    tile
    dense
  >
    <v-toolbar-title>
      {{ room && room.name ? room.name.toUpperCase() : '' }}
    </v-toolbar-title>

    <v-spacer />

    <v-tooltip v-if="room" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          :dark="!isDark"
          :light="isDark"
          :to="`/${room.path}/chat`"
          v-on="on"
        >
          <v-icon>
            fa-comments
          </v-icon>
        </v-btn>
      </template>
      <span>Chat</span>
    </v-tooltip>

    <v-tooltip v-if="room" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          :dark="!isDark"
          :light="isDark"
          :to="`/${room.path}/calls`"
          v-on="on"
        >
          <v-icon>
            fa-phone
          </v-icon>
        </v-btn>
      </template>
      <span>Calls</span>
    </v-tooltip>

    <v-tooltip v-if="room" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          :dark="!isDark"
          :light="isDark"
          :to="`/${room.path}/peers`"
          v-on="on"
        >
          <v-icon>
            fa-users
          </v-icon>
        </v-btn>
      </template>
      <span>Manage peers</span>
    </v-tooltip>

    <v-spacer />

    <v-menu
      v-if="room"
      v-model="menus.settings"
      bottom
      offset-y
    >
      <template v-slot:activator="{ on: menu }">
        <v-btn
          v-if="room"
          tile
          :dark="!isDark"
          :light="isDark"
          v-on="{ ...menu }"
        >
          <v-icon>
            mdi mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>
      <v-list dense multiple>
        <v-list-item :to="`/${room.path}/settings`">
          <v-list-item-title>
            <v-icon x-small>
              fa-cog
            </v-icon> Room settings
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="toggleRightPanel()">
          <v-list-item-title>
            <v-icon v-if="!panelRight" x-small>
              fa-chevron-left
            </v-icon>
            <v-icon v-if="panelRight" x-small>
              fa-chevron-right
            </v-icon>
            <span v-if="!panelRight">Show right panel</span>
            <span v-if="panelRight">Hide right panel</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>

export default {
  props: {
    room: {
      type: Object,
      default: null
    },
    roomRoute: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      menus: {
        settings: false
      }
    }
  },
  computed: {
    panelRight () {
      return this.$store.state.panel.right
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    toggleRightPanel () {
      this.$store.commit('panel/toggle', 'right', { root: true })
    }
  }
}
</script>
