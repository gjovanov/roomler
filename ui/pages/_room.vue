<template>
  <client-only>
    <v-card
      lg="12"
      md="12"
    >
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

        <v-tooltip bottom left>
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
      <nuxt-child />
    </v-card>
  </client-only>
</template>

<script>

export default {
  middleware: 'authenticated',
  computed: {
    room () {
      return this.$store.state.api.room.room
    },
    conferenceRoom () {
      return this.$store.state.api.conference.room
    }
  },
  mounted () {
    this.$store.commit('panel/set', { panel: 'chat', value: true }, { root: true })
  },
  beforeRouteLeave (to, from, next) {
    const session = this.$store.state.api.conference.session
    if (session) {
      const answer = window.confirm('Do you really want to leave from the conference? If you select "OK" you will get disconnected!')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next(true)
    }
  }
}
</script>
