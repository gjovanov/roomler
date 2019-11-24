<template>
  <div
    id="messages-list"
    ref="messages-list"
    v-scroll:#messages-list="onMessagesScroll"
    style="height: calc(100vh - 330px); overflow-y: auto; overflow-x: hidden"
  >
    <v-menu
      v-model="menu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <div
        style="width: 320px"
      >
        <template v-for="(emoji) in filterEmoji()">
          <v-btn
            :key="emoji.id"
            @click="addEmoji(emoji)"
          >
            {{ emoji.char }}
          </v-btn>
        </template>
      </div>
    </v-menu>
    <template v-for="(value, propertyName) in messages">
      <v-subheader :key="`subheader_${propertyName}`">
        {{ propertyName }}
      </v-subheader>
      <v-timeline
        :key="propertyName"
        :reverse="reverse"
        dense
      >
        <v-scroll-y-reverse-transition
          group
        >
          <v-timeline-item
            v-for="message in messages[propertyName]"
            :id="'message_item_' + getMessageId(message)"
            :key="getMessageId(message)"
            :icon="!message.author.avatar_url ? 'fa-user' : undefined"
            data-type="message_item"
          >
            <v-avatar v-if="message.author.avatar_url" slot="icon">
              <img :src="message.author.avatar_url">
            </v-avatar>
            <span slot="opposite">Tus eu perfecto</span>
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                :class="message.has_mention && !message.is_read ? 'mr-4 red lighten-4' : (!message.is_read || !message._id ? 'mr-4 orange lighten-4' : 'mr-4 white')"
                light
              >
                <v-card-title class="overline">
                  {{ message.author.username }}, {{ datetimeUtils.toHoursFormat(message.createdAt) }} &nbsp;
                  <v-tooltip v-if="message.has_mention" right>
                    <template v-slot:activator="{ on }">
                      <v-icon small color="red" v-on="on">
                        fa-at
                      </v-icon>
                    </template>
                    <span>You are mentioned in this messsage!</span>
                  </v-tooltip>
                  <v-btn
                    outlined
                    right
                    absolute
                    icon
                    @mouseover="showMenu($event, message)"
                  >
                    😄+
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <pre style="white-space: pre-wrap" v-html="message.content" />
                </v-card-text>
              </v-card>
            </v-hover>
            <v-spacer />
            <template v-for="(reaction, index) in message.reactions">
              <v-badge
                :key="index"
                right
                top
                overlap
                class="align-self-center"
                color="black"
              >
                <template v-slot:badge>
                  <span>3</span>
                </template>
                <v-btn tile outlined x-small :class="index !== 0 ? 'ml-3' : ''" color="primary">
                  {{ reaction.reaction.char }}
                </v-btn>
              </v-badge>
            </template>
          </v-timeline-item>
        </v-scroll-y-reverse-transition>
      </v-timeline>
    </template>
  </div>
</template>

<script>
import * as uuid from 'uuid/v4'
import * as cheerio from 'cheerio'
import * as EmojiMap from 'emojilib'
import Fuse from 'fuse.js'
import { domUtils } from '@/utils/dom-utils'
import { datetimeUtils } from '@/utils/datetime-utils'

const scrollDirection = {
  noScroll: 'no_scroll',
  bottom: 'bottom',
  top: 'top'
}
export default {
  props: {
    room: {
      type: Object,
      default: null
    },
    messages: {
      type: Object,
      default () {
        return {}
      }
    },
    unreads: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    const emojis = EmojiMap.ordered.map((name) => {
      const result = { ...EmojiMap.lib[name], name, key: uuid() }
      return result
    })
    return {
      emojis,
      datetimeUtils,
      autoScrollTimeout: null,
      manualScrollTimeout: null,
      mouseoverTimeout: null,
      reverse: false,
      selectedMessage: null,
      menu: false,
      filter: '',
      x: 0,
      y: 0,
      scroll: scrollDirection.bottom
    }
  },

  watch: {
    messages (newVal, oldVal) {
      const self = this
      if (this.scroll === scrollDirection.bottom || this.scroll === scrollDirection.top) {
        if (this.autoScrollTimeout) {
          clearTimeout(this.autoScrollTimeout)
        }
        this.autoScrollTimeout = setTimeout(() => {
          self.scrollMessages(this.scroll === scrollDirection.bottom)
          self.scroll = scrollDirection.bottom
        }, 200)
      }
    }
  },

  beforeMount () {
    const self = this
    window.addEventListener('focus', this.readUnreads)
    window.addEventListener('unload', () => {
      window.removeEventListener('focus', self.readUnreads)
    })
  },

  beforeDestroy () {
    window.removeEventListener('focus', this.readUnreads)
  },

  methods: {
    filterEmoji () {
      if (!this.filter) {
        return this.emojis.slice(0, 30)
      }
      const fuse = new Fuse(this.emojis, {
        threshold: 0.2,
        keys: ['name', 'keywords']
      })
      const result = fuse.search(this.filter).slice(0, 30)
      console.log(result)
      return result
    },
    showMenu (e, message) {
      const self = this
      console.log(e.clientX)
      self.x = e.clientX
      self.y = e.clientY - 100
      self.selectedMessage = message
      self.menu = true
    },
    getMessageId (message) {
      return message._id || message.client_id
    },
    scrollMessages (bottom = true) {
      const messagesList = this.$refs['messages-list']
      if (messagesList) {
        messagesList.scrollTop = bottom ? messagesList.scrollHeight : messagesList.scrollTop + 10
        this.$vuetify.goTo('#new-message-txt')
      }
    },
    onMessagesScroll (e) {
      if (this.manualScrollTimeout) {
        clearTimeout(this.manualScrollTimeout)
      }
      this.manualScrollTimeout = setTimeout(async () => {
        await this.readUnreads()
        if (e.target.scrollTop === 0) {
          this.scroll = scrollDirection.top
          await this.loadPreviousMessages()
        }
      }, 100)
    },
    async loadPreviousMessages () {
      const payload = { room: this.room }
      const messageKeys = Object.keys(this.messages).sort().reverse()
      if (this.messages && messageKeys.length) {
        payload.before = this.messages[messageKeys[0]][0].createdAt
      }
      await this.$store.dispatch('api/message/getAll', payload)
    },
    async readUnreads () {
      const self = this
      if (this.unreads && document.hasFocus()) {
        const messagesInView = []
        this.unreads.forEach((message) => {
          const messageList = document.getElementById('messages-list')
          const messageItem = document.getElementById(`message_item_${self.getMessageId(message)}`)
          const inView = domUtils.isScrolledIntoView(messageItem)
          if (messageList && messageItem && inView) {
            messagesInView.push(message._id)
          }
        })
        if (messagesInView && messagesInView.length) {
          this.scroll = scrollDirection.noScroll
          await this.$store.dispatch('api/message/readby/pushAll', messagesInView)
        }
      }
    },

    async addEmoji (emoji) {
      await this.$store
        .dispatch('api/message/reaction/push', {
          message: this.selectedMessage._id,
          data: {
            type: 'emoji',
            reaction: {
              name: emoji.name,
              char: emoji.char,
              keywords: emoji.keywords
            }
          }
        })
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
