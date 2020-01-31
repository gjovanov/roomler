<template>
  <div>
    <v-chip
      v-for="(reactionGroup, name, index) in reactions"
      :key="name"
      :class="index !== 0 ? 'ml-3' : ''"
      @click="toggleReaction(message, { name, char: reactionGroup.symbol })"
      class="mt-2"
      tile
      outlined
      color="primary"
    >
      {{ reactionGroup.symbol }}
      <v-avatar
        right
        class="green darken-4"
      >
        {{ reactionGroup.list.length }}
      </v-avatar>
    </v-chip>
  </div>
</template>
<script>
export default {
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
  methods: {
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
