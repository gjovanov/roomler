<template>
  <v-expansion-panels
    v-model="panels"
    accordion
    multiple
  >
    <v-expansion-panel v-if="isRoomPeer && roomPeers && roomPeers.length >= 0" v-show="session">
      <v-expansion-panel-header>
        <div>
          <v-icon>
            fa-phone
          </v-icon> &nbsp;
          <span>CONFERENCE - {{ conferenceRoom ? conferenceRoom.name.toUpperCase() : room.name.toUpperCase() }}</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <conference :user="user" :room="room" :peers="peers" :room-peers="roomPeers" :session="session" />
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel v-if="panelChat && !isRoomPeer">
      <v-expansion-panel-header>
        <div>
          <v-icon>
            fa-sign-in-alt
          </v-icon> &nbsp;
          <span>JOIN THIS ROOM</span>
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
    <v-expansion-panel v-if="panelChat && isRoomPeer && roomPeers && roomPeers.length === 0">
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
          v-if="roomPeers && roomPeers.length === 0"
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
    <v-expansion-panel v-if="isRoomPeer && roomPeers && roomPeers.length >= 0" v-show="panelChat">
      <v-expansion-panel-header>
        <div>
          <v-icon>
            fa-comments
          </v-icon> &nbsp;
          <span>CHAT - {{ room.name.toUpperCase() }}</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <chat
          :elem-id="'messages-list'"
          :input-id="'new-message-txt'"
          :room="room"
          :messages="messages"
          :unreads="unreads"
          :panel-chat="panelChat"
        />
        <tiptap
          :elem-id="'new-message-txt'"
          :users="roomPeers"
          :gallery="room.path"
          @sendMessage="sendMessage"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import Tiptap from '@/components/editor/tiptap'
import RoomInvite from '@/components/room/room-invite'
import Conference from '@/components/conference/conference'
import Chat from '@/components/chat/chat'
import * as cheerio from 'cheerio'
import * as uuid from 'uuid/v4'

const scrollDirection = {
  noScroll: 'no_scroll',
  bottom: 'bottom',
  top: 'top'
}

export default {
  components: {
    Tiptap,
    RoomInvite,
    Conference,
    Chat
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
  },
  data () {
    return {
      panels: [0, 1, 2],
      reverse: false,
      menu: false,
      scroll: scrollDirection.noScroll
    }
  },
  computed: {
    isRoomPeer () {
      return this.$store.getters['api/room/isRoomPeer'](this.room)
    },
    messages () {
      return this.$store.getters['api/message/dailyMessages'](this.room._id)
    },
    unreads () {
      return this.$store.getters['api/message/unreads'](this.room._id)
    },
    panelRight () {
      return this.$store.state.panel.right
    },
    panelChat () {
      return this.$store.state.panel.chat
    }
  },

  watch: {
    async room (newVal) {
      if (newVal) {
        await this.$store.dispatch('api/message/getAll', { room: newVal })
      }
    },
    isRoomRoute (newVal) {
      this.$store.commit('panel/set', { panel: 'chat', value: newVal }, { root: true })
    }
  },

  methods: {
    async join () {
      await this.$store.dispatch('api/room/members/push', { room: this.room._id, user: this.user._id })
      await this.$store.dispatch('api/message/getAll', { room: this.room })
    },
    async sendMessage (content) {
      if (content) {
        const $ = cheerio.load(content)
        const mentions = [...new Set($('a[data-username]').toArray().map(node => node.attribs.userkey))]
        await this.$store
          .dispatch('api/message/create', {
            room: this.room,
            message: {
              client_id: uuid(),
              type: 'text',
              content,
              mentions
            }
          })
      }
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
