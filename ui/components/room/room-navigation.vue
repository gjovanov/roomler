<template>
  <v-toolbar
    v-if="room || conferenceRoom"
    tile
    dense
    style="background-color: #363636; height: 56px;"
  >
    <v-toolbar-title>
      {{ room && room.name ? room.name.toUpperCase() : '' }}
    </v-toolbar-title>

    <v-spacer />

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          light
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

    <v-tooltip v-if="!conferenceRoom || (room && conferenceRoom && room._id == conferenceRoom._id)" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          light
          :to="`/${room.path}/calls`"
          v-on="on"
        >
          <v-icon>
            fa-phone-volume
          </v-icon>
        </v-btn>
      </template>
      <span>Calls</span>
    </v-tooltip>

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          light
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

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          light
          :to="`/${room.path}/settings`"
          v-on="on"
        >
          <v-icon>
            fa-cog
          </v-icon>
        </v-btn>
      </template>
      <span>Manage settings</span>
    </v-tooltip>
  </v-toolbar>
</template>

<script>

export default {
  props: {
    room: {
      type: Object,
      default: null
    },
    conferenceRoom: {
      type: Object,
      default: null
    }
  },

  computed: {
    panelLeft () {
      return this.$store.state.panel.left
    },
    panelRight () {
      return this.$store.state.panel.right
    },
    panelChat () {
      return this.$store.state.panel.chat
    },
    panelConference () {
      return this.$store.state.panel.conference
    }
  },
  methods: {
    toggle (panel) {
      this.$store.commit('panel/toggle', panel)
    }
  }
}
</script>
