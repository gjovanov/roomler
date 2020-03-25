<template>
  <v-toolbar
    v-if="room"
    tile
    dense
    style="background-color: #363636; height: 56px;"
  >
    <v-toolbar-title>
      {{ conferenceRoom ? conferenceRoom.name.toUpperCase() : room.name.toUpperCase() }}
    </v-toolbar-title>

    <v-spacer />

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          small
          class="v-btn--active"
          :to="`/${room.path}`"
          v-on="on"
        >
          <v-icon small>
            fa-comments
          </v-icon>
        </v-btn>
      </template>
      <span>Chat</span>
    </v-tooltip>

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          small
          class="v-btn--active"
          :to="`/${room.path}/peers`"
          v-on="on"
        >
          <v-icon small>
            fa-users
          </v-icon>
        </v-btn>
      </template>
      <span>Manage peers</span>
    </v-tooltip>

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          v-show="!session"
          tile
          small
          class="v-btn--active"
          :to="`/${room.path}/settings`"
          v-on="on"
        >
          <v-icon small>
            fa-cog
          </v-icon>
        </v-btn>
      </template>
      <span>Manage settings</span>
    </v-tooltip>

    <v-spacer />

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          small
          :text="panelRight"
          class="v-btn--active"
          @click="toggle('right')"
          v-on="on"
        >
          <v-icon v-if="panelRight" small>
            fa-caret-square-right
          </v-icon>
          <v-icon v-if="!panelRight" small>
            fa-caret-square-left
          </v-icon>
        </v-btn>
      </template>
      <span v-if="panelRight">Hide right panel</span>
      <span v-if="!panelRight">Show right panel</span>
    </v-tooltip>
  </v-toolbar>
</template>

<script>

export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    },
    session: {
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
