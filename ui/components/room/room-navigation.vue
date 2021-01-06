<template>
  <v-toolbar
    v-if="room && roomRoute"
    tile
    dense
  >
    <v-toolbar-title class="ml-4">
      <span class="text-uppercase" style="font-weight: 500">{{ room && room.name ? room.name : '' }}</span>
    </v-toolbar-title>

    <v-spacer />

    <v-tooltip v-if="room" bottom left>
      <template #activator="{ on }">
        <v-btn
          v-if="room"
          tile
          :dark="!isDark"
          :light="isDark"
          :to="localePath({ name: 'room-chat', params: { room: `${room.path}` } })"
          elevation="0"
          v-on="on"
        >
          <v-icon>
            fa-comments
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('comps.room.chat') }}</span>
    </v-tooltip>

    <v-tooltip v-if="room" bottom left>
      <template #activator="{ on }">
        <v-btn
          v-if="room"
          tile
          :dark="!isDark"
          :light="isDark"
          :to="localePath({ name: 'room-calls', params: { room: `${room.path}` } })"
          elevation="0"
          v-on="on"
        >
          <v-icon>
            fa-phone
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('comps.room.conference') }}</span>
    </v-tooltip>

    <v-tooltip v-if="room" bottom left>
      <template #activator="{ on }">
        <v-btn
          v-if="room"
          tile
          :dark="!isDark"
          :light="isDark"
          :to="localePath({ name: 'room-peers', params: { room: `${room.path}` } })"
          elevation="0"
          v-on="on"
        >
          <v-icon>
            fa-users
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('comps.room.participants') }}</span>
    </v-tooltip>

    <v-spacer />

    <v-menu
      v-if="room"
      v-model="menus.settings"
      bottom
      offset-y
      open-on-hover
    >
      <template #activator="{ on: menu }">
        <v-btn
          v-if="room"
          tile
          :dark="!isDark"
          :light="isDark"
          class="mr-9"
          elevation="0"
          v-on="{ ...menu }"
        >
          <v-icon>
            mdi mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>
      <v-list dense multiple>
        <v-list-item :to="localePath({ name: 'room-settings', params: { room: `${room.path}` } })">
          <v-list-item-title>
            <v-icon x-small>
              fa-cog
            </v-icon> {{ $t('comps.room.roomSettings') }}
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
            <span v-if="!panelRight">{{ $t('comps.room.showRightPanel') }}</span>
            <span v-if="panelRight">{{ $t('comps.room.hideRightPanel') }}</span>
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
