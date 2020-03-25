<template>
  <client-only>
    <v-container>
      <v-row>
        <v-col cols="12">
          <conference-navigation
            :user="user"
            :room="room"
            :session="session"
            :local-handle="localHandle"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <chat
            :name="'conference'"
            :user="user"
            :room="room"
            :room-peers="roomPeers"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <conference
            :user="user"
            :room="room"
            :session="session"
            :peers="peers"
            :room-peers="roomPeers"
            :conference-room="conferenceRoom"
            :conference-position="conferencePostion"
          />
          <portal-target name="conference-center" />
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>

<script>
import Chat from '@/components/chat/chat'
import Conference from '@/components/conference/conference'
import ConferenceNavigation from '@/components/conference/conference-navigation'

export default {
  middleware: 'authenticated',
  components: {
    Chat,
    Conference,
    ConferenceNavigation
  },
  data () {
    return {
      panels: [0, 1]
    }
  },
  computed: {
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
    conferencePostion () {
      return this.$store.state.api.conference.position
    },
    localHandle () {
      return this.$store.getters['api/conference/localHandle']
    },
    peers () {
      return this.$store.getters['api/auth/getPeers']
    },
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    },
    isRoomPeer () {
      return this.$store.getters['api/room/isRoomPeer'](this.room)
    }
  },
  mounted () {
    this.$store.commit('api/conference/setPosition', 'center', { root: true })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('api/conference/setPosition', 'left', { root: true })
    next(true)
  }
}
</script>

<style>
table {
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid black;
}
</style>
