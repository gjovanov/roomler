<template>
  <v-menu
    v-model="menu"
    open-on-hover
    left
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        outlined
        dark
      >
        {{ invite.type }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-if="invite.type !== 'member'"
        @click="toMember()"
      >
        <v-list-item-title>
          Demote to Member
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item
        v-if="invite.type !== 'moderator'"
        @click="toModerator()"
      >
        <v-list-item-title>
          Promote to Moderator
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  props: {
    invite: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      menu: false
    }
  },
  methods: {
    toMember () {
      this.$emit('toMember', this.invite)
    },
    toModerator () {
      this.$emit('toModerator', this.invite)
    }
  }
}
</script>
