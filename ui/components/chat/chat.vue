<template>
  <portal :to="name === 'conference' ? 'chat-left' : 'chat-center'">
    <chat-messages
      :elem-id="messageListId"
      :input-id="newMessageId"
      :room="room"
      :messages="messages"
      :unreads="unreads"
      :panel-chat="panelChat"
    />
    <tiptap
      :elem-id="newMessageId"
      :users="roomPeers"
      :gallery="room.path"
      @sendMessage="sendMessage"
    />
  </portal>
</template>

<script>
import Tiptap from '@/components/editor/tiptap'
import ChatMessages from '@/components/chat/chat-messages'
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
    ChatMessages
  },
  props: {
    name: {
      type: String,
      default: null
    },
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    },
    roomPeers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      panels: 0,
      reverse: false,
      menu: false,
      scroll: scrollDirection.noScroll
    }
  },
  computed: {
    messageListId () {
      return `messages-list-${this.name}`
    },
    newMessageId () {
      return `new-message-${this.name}`
    },
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
