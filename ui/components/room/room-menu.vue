<template>
  <v-menu
    v-model="menu"
    open-on-hover
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        text
        x-small
        v-on="on"
      >
        <v-icon small>
          fa-ellipsis-h
        </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-if="canManage" @click="add()">
        <v-list-item-title>
          <v-icon>fa-plus</v-icon> Create nested room
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canManage" @click="edit()">
        <v-list-item-title>
          <v-icon>fa-edit</v-icon> Edit
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canDelete" @click="removeConsent()">
        <v-list-item-title>
          <v-icon>fa-trash</v-icon> Delete room
        </v-list-item-title>
      </v-list-item>
      <v-divider />

      <v-list-item v-if="canManage && peers && peers.length" @click="addPeers()">
        <v-list-item-title>
          <v-icon>fa-users</v-icon> Add existing
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canManage" @click="invitePeers()">
        <v-list-item-title>
          <v-icon>fa-paper-plane</v-icon> Invite new
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canManage" @click="linkPeers()">
        <v-list-item-title>
          <v-icon>fa-link</v-icon> Share link
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canJoin" @click="join()">
        <v-list-item-title>
          <v-icon>fa-sign-in-alt</v-icon> Join this room
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canLeave && !isOwner" @click="leaveConsent()">
        <v-list-item-title>
          <v-icon>fa-sign-out-alt</v-icon> Leave this room
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
    peers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      menu: false
    }
  },
  computed: {
    isPeer () {
      return this.room &&
        this.user &&
        (this.room.owner === this.user._id ||
        this.room.moderators.includes(this.user._id) ||
        this.room.members.includes(this.user._id))
    },
    isOwner () {
      return this.room && this.user && this.room.owner === this.user._id
    },
    canJoin () {
      return !this.isPeer
    },
    canLeave () {
      return this.isPeer
    },
    canDelete () {
      return this.isOwner
    },
    canManage () {
      return this.room && this.user && (this.isOwner || this.room.moderators.includes(this.user._id))
    }
  },
  methods: {
    add () {
      this.$emit('add', this.room)
    },
    edit () {
      this.$emit('edit', this.room)
    },
    removeConsent () {
      this.$emit('removeConsent', this.room)
    },
    addPeers () {
      this.$router.push({ path: `/${this.room.path}/peers?add` })
    },
    invitePeers () {
      this.$router.push({ path: `/${this.room.path}/peers?invite` })
    },
    linkPeers () {
      this.$router.push({ path: `/${this.room.path}/peers?link` })
    },
    join () {
      this.$emit('join', this.room, this.user)
    },
    leaveConsent () {
      this.$emit('leaveConsent', this.room)
    }
  }
}
</script>
