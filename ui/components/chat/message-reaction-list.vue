<template>
  <div>
    <view-reaction-menu
      :open="menu.viewReaction.open"
      :x="menu.viewReaction.x"
      :y="menu.viewReaction.y"
      :reactions="menu.viewReaction.reactions"
      @hideMenu="hideMenu"
    />
    <v-chip
      v-for="(reactionGroup, name, index) in reactions"
      :key="name"
      :class="index !== 0 ? 'ml-3' : ''"
      class="mt-2"
      tile
      outlined
      color="primary"
      @click="toggleReaction(message, { name, char: reactionGroup.symbol })"
      @mouseover="showMenu($event, reactionGroup.list)"
    >
      {{ reactionGroup.symbol }}
      <v-avatar
        right
        class="accent"
      >
        {{ reactionGroup.list.length }}
      </v-avatar>
    </v-chip>
  </div>
</template>
<script>
import ViewReactionMenu from '@/components/chat/view-reaction-menu'

export default {
  components: {
    ViewReactionMenu
  },
  props: {
    message: {
      type: Object,
      default () {
        return {}
      }
    },
    reactions: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      menu: {
        viewReaction: {
          x: 0,
          y: 0,
          open: false,
          reactions: []
        }
      }
    }
  },
  methods: {
    showMenu (e, reactions) {
      if (!this.menu.viewReaction.open) {
        this.menu.viewReaction.x = e.clientX
        this.menu.viewReaction.y = e.clientY - 100
        this.menu.viewReaction.reactions = reactions
        this.menu.viewReaction.open = true
      }
    },
    hideMenu () {
      this.menu.viewReaction.open = false
    },

    async toggleReaction (message, emoji) {
      const myReaction = message.reactions.find(r => r.user === this.$store.state.api.auth.user._id)
      this.$emit('noScroll')
      if (message.has_reaction && myReaction && myReaction.name === emoji.name) {
        await this.pullReaction(message)
      } else {
        await this.pushReaction(message, emoji)
      }
    },
    async pushReaction (message, emoji) {
      this.$emit('noScroll')
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
      this.$emit('noScroll')
      await this.$store
        .dispatch('api/message/reaction/pull', {
          id: message._id,
          data: { }
        })
    }
  }
}
</script>
