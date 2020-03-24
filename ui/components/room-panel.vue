<template>
  <client-only>
    <v-container fluid class="pa-0 ma-0">
      <v-row>
        <v-col cols="12" class="pt-0 pb-0">
          <room-navigation
            :room="room"
            :user="user"
            :session="session"
            :conference-room="conferenceRoom"
          />
        </v-col>
      </v-row>
      <v-row class="pt-0 pb-0">
        <v-col cols="12" class="pt-0 pb-0">
          <room-accordion
            :room="room"
            :session="session"
            :conference-room="conferenceRoom"
            :user="user"
            :peers="peers"
            :room-peers="roomPeers"
            :is-room-route="isRoomRoute"
          />
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>

<script>
import RoomNavigation from '@/components/room/room-navigation'
import RoomAccordion from '@/components/room/room-accordion'

export default {
  components: {
    RoomNavigation,
    RoomAccordion
  },
  props: {
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
    },
    user: {
      type: Object,
      default: null
    },
    peers: {
      type: Array,
      default () {
        return []
      }
    },
    roomPeers: {
      type: Array,
      default () {
        return []
      }
    },
    isRoomRoute: {
      type: Boolean,
      default: false
    }
  }
}
</script>
