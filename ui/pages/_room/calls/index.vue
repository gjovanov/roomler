<template>
  <client-only>
    <v-expansion-panels
      v-model="panels"
      accordion
      style="height: 100%"
    >
      <v-expansion-panel v-if="!isRoomPeer">
        <v-expansion-panel-header>
          <div>
            <v-icon>
              fa-sign-in-alt
            </v-icon> &nbsp;
            <span>JOIN THIS ROOM - [{{ room && room.name ? room.name.toUpperCase() : '' }}]</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            dense
            align="center"
            justify="center"
          >
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-btn dark block outlined class="red" @click="join()">
                <v-icon>fa-users</v-icon> &nbsp; Join
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="isRoomPeer && roomPeers && roomPeers.length >= 0">
        <v-expansion-panel-header>
          <div>
            <v-icon>
              fa-comments
            </v-icon> &nbsp;
            <span>CONFERENCE - [{{ room.name.toUpperCase() }}]</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="height: 100%" class="pb-0">
          <conference-navigation
            :user="user"
            :room="room"
            :session="session"
            :conference-room="conferenceRoom"
          />
          <portal-target name="conference-center" />
          <portal-target name="chat-center" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </client-only>
</template>

<script>

import ConferenceNavigation from '@/components/conference/conference-navigation'

export default {
  middleware: 'authenticated',
  components: {
    ConferenceNavigation
  },
  data () {
    return {
      panels: 0
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
  },
  methods: {
    async join () {
      await this.$store.dispatch('api/room/members/push', { room: this.room._id, user: this.user._id })
      await this.$store.dispatch('api/message/getAll', { room: this.room })
    }
  }
}
</script>
