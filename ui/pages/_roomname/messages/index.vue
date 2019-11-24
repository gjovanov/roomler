<template>
  <client-only>
    <v-container>
      <v-row
        v-if="members.length === 1"
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
      <v-row
        v-if="members.length >= 1"
        dense
        align="center"
        justify="center"
      >
        <v-col

          cols="12"
          sm="12"
        >
          <chat :room="room" :messages="messages" :unreads="unreads" />
        </v-col>
      </v-row>
      <v-row v-if="!!room">
        <v-col
          cols="12"
          sm="12"
          light
        >
          <tiptap id="new-message-txt" :users="members" :gallery="room.path" @sendMessage="sendMessage" />
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>

<script>
import * as uuid from 'uuid/v4'
import * as cheerio from 'cheerio'
import Tiptap from '@/components/editor/tiptap'
import RoomInvite from '@/components/room/room-invite'
import Chat from '@/components/message/chat'

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
    Chat
  },
  data () {
    return {
      reverse: false,
      menu: false,
      scroll: scrollDirection.noScroll
    }
  },
  computed: {
    room () {
      return this.$store.state.api.room.rooms.find(r => r.name.toLowerCase() === this.$route.params.roomname.toLowerCase())
    },
    members () {
      const users = this.room ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
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
