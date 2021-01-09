<template>
  <v-menu
    v-model="menu"
    open-on-hover
    offset-x
  >
    <template #activator="{ on }">
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
          <v-icon>fa-plus</v-icon> {{ $t('comps.room.createNestedRoom') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canManage" @click="edit()">
        <v-list-item-title>
          <v-icon>fa-edit</v-icon> {{ $t('comps.room.editRoom') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canDelete" @click="removeConsent()">
        <v-list-item-title>
          <v-icon>fa-trash</v-icon> {{ $t('comps.room.deleteRoom') }}
        </v-list-item-title>
      </v-list-item>
      <v-divider />

      <v-list-item v-if="canManage && peers && peers.length" @click="addPeers()">
        <v-list-item-title>
          <v-icon>fa-user-plus</v-icon> {{ $t('comps.room.addExisting') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canManage" @click="invitePeers()">
        <v-list-item-title>
          <v-icon>fa-paper-plane</v-icon> {{ $t('comps.room.inviteNew') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canManage" @click="linkPeers()">
        <v-list-item-title>
          <v-icon>fa-link</v-icon> {{ $t('comps.room.shareLink') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canJoin" @click="join()">
        <v-list-item-title>
          <v-icon>fa-sign-in-alt</v-icon> {{ $t('comps.room.joinThisRoom') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="canLeave && !isOwner" @click="leaveConsent()">
        <v-list-item-title>
          <v-icon>fa-sign-out-alt</v-icon> {{ $t('comps.room.leaveThisRoom') }}
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
      this.$router.push({ path: this.localePath({ name: 'room-peers', params: { room: `${this.room.path}` }, query: { add: null } }) })
    },
    invitePeers () {
      this.$router.push({ path: this.localePath({ name: 'room-peers', params: { room: `${this.room.path}` }, query: { invite: null } }) })
    },
    linkPeers () {
      this.$router.push({ path: this.localePath({ name: 'room-peers', params: { room: `${this.room.path}` }, query: { link: null } }) })
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
