<template>
  <client-only>
    <v-expansion-panels
      v-model="panels"
      accordion
      multiple
    >
      <v-expansion-panel v-if="members && members.length === 1">
        <v-expansion-panel-header>Invite</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            v-if="members && members.length === 1"
            dense
            align="center"
            justify="center"
          >
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <room-invite :room="room" />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="members && members.length >= 1">
        <v-expansion-panel-header>Conference</v-expansion-panel-header>
        <v-expansion-panel-content>
          <conference :user="user" :room="room" :members="members" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="members && members.length >= 1">
        <v-expansion-panel-header>Chat</v-expansion-panel-header>
        <v-expansion-panel-content>
          <chat :elem-id="'messages-list'" :input-id="'new-message-txt'" :room="room" :messages="messages" :unreads="unreads" />
          <tiptap :elem-id="'new-message-txt'" :users="members" :gallery="room.path" @sendMessage="sendMessage" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </client-only>
</template>

<script>
import * as uuid from 'uuid/v4'
import * as cheerio from 'cheerio'
import Tiptap from '@/components/editor/tiptap'
import RoomInvite from '@/components/room/room-invite'
import Conference from '@/components/conference/conference'
import Chat from '@/components/chat/chat'

const scrollDirection = {
  noScroll: 'no_scroll',
  bottom: 'bottom',
  top: 'top'
}

export default {
  middleware: 'authenticated',
  components: {
    Tiptap,
    RoomInvite,
    Conference,
    Chat
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
    user () {
      return this.$store.state.api.auth.user
    },
    room () {
      return this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname)
    },
    members () {
      const users = this.room && this.room._id ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
      return users
    },
    messages () {
      const roomname = this.$route.params.roomname.toLowerCase()
      return this.$store.getters['api/message/dailyMessages'](roomname)
    },
    unreads () {
      const roomname = this.$route.params.roomname.toLowerCase()
      return this.$store.getters['api/message/unreads'](roomname)
    }
  },

  async mounted () {
    if (this.room) {
      await this.$store.dispatch('api/message/getAll', { room: this.room })
    }
  },

  methods: {
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
