<template>
  <v-menu
    v-model="menu"
    open-on-hover
    bottom
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="role === 'owner'"
        v-on="on"
        outlined
        dark
      >
        {{ role }}
      </v-btn>
    </template>
    <v-list v-if="role !== 'owner'">
      <v-list-item
        v-if="currentRole === 'owner'"
        @click="openTransfer()"
      >
        <v-list-item-title>
          Transfer Ownership
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item
        v-if="role !== 'member'"
        @click="toMember()"
      >
        <v-list-item-title>
          Demote to Member
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item
        v-if="role !== 'moderator'"
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
    user: {
      type: Object,
      default: null
    },
    role: {
      type: String,
      default: null
    },
    currentRole: {
      type: String,
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
      this.$emit('toMember', this.user)
    },
    toModerator () {
      this.$emit('toModerator', this.user)
    },
    openTransfer () {
      this.$emit('openTransfer', this.user)
    }
  }
}
</script>
