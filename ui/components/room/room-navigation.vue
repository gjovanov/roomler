<template>
  <v-toolbar
    v-if="room && roomRoute"
    tile
    dense
    style="background-color: #363636; height: 56px;"
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

    <v-tooltip v-if="room" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          light
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

    <v-tooltip v-if="room" bottom left>
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
    roomRoute: {
      type: String,
      default: null
    }
  }
}
</script>
