<template>
  <v-menu
    v-model="menu"
    open-on-hover
    left
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        outlined
        dark
        :disabled="user.role === 'owner'"
        v-on="on"
      >
        {{ user.role }}
      </v-btn>
    </template>
    <v-list v-if="user.role !== 'owner'">
      <v-list-item
        v-if="user.role !== 'member'"
      >
        @click="toMember()">
        <v-list-item-title>
          Demote to Member
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item
        v-if="user.role !== 'moderator'"
      >
        @click="toModerator()">
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
    user: {
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
      this.$emit('toMember', this.invite, 'member')
    },
    toModerator () {
      this.$emit('toModerator', this.invite, 'moderator')
    }
  }
}
</script>
