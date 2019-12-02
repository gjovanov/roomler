<template>
  <div
    id="messages-list"
    ref="messages-list"
    v-scroll:#messages-list="onMessagesScroll"
    style="height: calc(100vh - 330px); overflow-y: auto; overflow-x: hidden"
  >
    <add-reaction-menu
      :open="menu.addReaction.open"
      :emojis="emojis"
      :x="menu.addReaction.x"
      :y="menu.addReaction.y"
      :message="menu.addReaction.message"
      @pushReaction="pushReaction"
      @hideMenu="menu.addReaction.open = false"
    />
    <template v-for="(value, propertyName) in messages">
      <v-subheader :key="`subheader_${propertyName}`">
        {{ propertyName }}
      </v-subheader>
      <v-timeline
        :key="propertyName"
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
                    rounded
                    right
                    absolute
                    @mouseover="showMenu($event, message)"
                  >
                    😄
                    +
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <pre style="white-space: pre-wrap" v-html="message.content" />
                </v-card-text>
              </v-card>
            </v-hover>
            <v-spacer />
            <template v-for="(reactionGroup, name, index) in getReactions(message)">
              <v-chip
                :key="name"
                class="mt-2"
                tile
                outlined
                :class="index !== 0 ? 'ml-3' : ''"
                color="primary"
                @click="toggleReaction(message, { name, char: reactionGroup.symbol })"
              >
                {{ reactionGroup.symbol }}
                <v-avatar
                  right
                  class="green darken-4"
                >
                  {{ reactionGroup.list.length }}
                </v-avatar>
              </v-chip>
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
import { domUtils } from '@/utils/dom-utils'
import { datetimeUtils } from '@/utils/datetime-utils'
import AddReactionMenu from '@/components/message/add-reaction-menu'

const scrollDirection = {
  noScroll: 'no_scroll',
  bottom: 'bottom',
  top: 'top'
}
export default {
  components: {
    AddReactionMenu
  },
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
      selectedMessage: null,
      menu: {
        addReaction: {
          x: 0,
          y: 0,
          open: false,
          message: null
        },
        reactionMembers: {
          x: 0,
          y: 0,
          open: false
        }
      },
      scroll: scrollDirection.bottom
    }
  },

  watch: {
    messages (newVal, oldVal) {
      const self = this
      this.$nextTick(() => {
        if (self.autoScrollTimeout) {
          clearTimeout(self.autoScrollTimeout)
        }
        self.autoScrollTimeout = setTimeout(() => {
          if (self.scroll === scrollDirection.bottom || self.scroll === scrollDirection.top) {
            self.scrollMessages(self.scroll === scrollDirection.bottom)
          }
          self.scroll = scrollDirection.bottom
        }, 300)
      })
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
    getReactions (message) {
      const result = this.$store.getters['api/message/reactions'](message)
      return result
    },

    showMenu (e, message) {
      this.menu.addReaction.x = e.clientX
      this.menu.addReaction.y = e.clientY - 100
      this.menu.addReaction.message = message
      this.menu.addReaction.open = true
    },

    getMessageId (message) {
      return message._id || message.client_id
    },
    scrollMessages (bottom = true) {
      const messagesList = this.$refs['messages-list']
      if (messagesList) {
        const newScrollTop = bottom ? messagesList.scrollHeight : messagesList.scrollTop + 10
        messagesList.scrollTop = newScrollTop
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

    async toggleReaction (message, emoji) {
      const myReaction = message.reactions.find(r => r.user._id === this.$store.state.api.auth.user._id)
      this.scroll = scrollDirection.noScroll
      if (message.has_reaction && myReaction && myReaction.name === emoji.name) {
        await this.pullReaction(message)
      } else {
        await this.pushReaction(message, emoji)
      }
    },

    async pushReaction (message, emoji) {
      this.scroll = scrollDirection.noScroll
      await this.$store
        .dispatch('api/message/reaction/push', {
          id: message._id,
          data: {
            name: emoji.name,
            symbol: emoji.char
          }
        })
    },

    async pullReaction (message) {
      this.scroll = scrollDirection.noScroll
      await this.$store
        .dispatch('api/message/reaction/pull', {
          id: message._id,
          data: { }
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
