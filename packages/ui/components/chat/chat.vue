<template>
  <portal v-if="room" :to="name === 'conference' ? 'chat-left' : 'chat-center'">
    <chat-messages
      :elem-id="messageListId"
      :input-id="newMessageId"
      :user="user"
      :room="room"
      :messages="messages"
      :unreads="unreads"
      :is-chat-panel="isChatPanel"
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
import * as cheerio from 'cheerio'
import { v4 as uuid } from 'uuid'

const scrollDirection = {
  noScroll: 'no_scroll',
  bottom: 'bottom',
  top: 'top'
}
export default {
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
    roomRoute: {
      type: String,
      default: null
    },
    isChatPanel: {
      type: Boolean,
      default: false
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
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
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
    async sendMessage (content) {
      if (content && content !== '<p></p>') {
        const $ = cheerio.load(content)
        const mentions = [...new Set($('a[data-username]').toArray().map(node => node.attribs.userkey))]
        const files = [...new Set($('a[data-upload]').toArray().map((node) => {
          return {
            filename: node.attribs.filename,
            href: node.attribs.href
          }
        }))]
        const images = [...new Set($('img[data-upload]').toArray().map((node) => {
          return {
            filename: node.attribs.title,
            href: node.attribs.src
          }
        }))]
        await this.$store
          .dispatch('api/message/create', {
            room: this.room,
            message: {
              client_id: uuid(),
              type: 'text',
              content,
              mentions,
              files: files.concat(images)
            }
          })
      }
    }
  }
}
</script>
