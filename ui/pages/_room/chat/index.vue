<template>
  <client-only>
    <v-expansion-panels
      v-model="panels"
      accordion
    >
      <v-expansion-panel v-if="!isRoomPeer">
        <v-expansion-panel-header>
          <div>
            <v-icon>
              fa-sign-in-alt
            </v-icon> &nbsp;
            <span>JOIN THIS ROOM - [{{ room.name.toUpperCase() }}]</span>
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
      <v-expansion-panel v-if="isRoomPeer && roomPeers && roomPeers.length === 1">
        <v-expansion-panel-header>
          <div>
            <v-icon>
              fa-paper-plane
            </v-icon> &nbsp;
            <span>INVITE</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            v-if="roomPeers && roomPeers.length === 1"
            dense
            align="center"
            justify="center"
          >
            <v-col
              cols="12"
              sm="4"
              md="3"
            >
              <room-invite :room="room" :peers="peers" />
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
            <span>CHAT - [{{ room.name.toUpperCase() }}]</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="height: 100%" class="pb-0">
          <chat
            :name="'center'"
            :user="user"
            :room="room"
            :room-peers="roomPeers"
          />
          <portal-target name="chat-center" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </client-only>
</template>

<script>
import RoomInvite from '@/components/room/room-invite'
import Chat from '@/components/chat/chat'

export default {
  middleware: 'authenticated',
  components: {
    RoomInvite,
    Chat
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

  methods: {
    async join () {
      await this.$store.dispatch('api/room/members/push', { room: this.room._id, user: this.user._id })
      await this.$store.dispatch('api/message/getAll', { room: this.room })
    }
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
