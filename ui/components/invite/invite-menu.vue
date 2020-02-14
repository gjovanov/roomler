<template>
  <v-menu
    v-model="menu"
    open-on-hover
    bottom
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="invite.status !== 'pending'"
        v-on="on"
        fab
        small
        text
        dark
      >
        <v-icon>fa-edit</v-icon>
      </v-btn>
    </template>
    <v-list v-if="invite.status === 'pending'">
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
    room: {
      type: Object,
      default: null
    },
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
