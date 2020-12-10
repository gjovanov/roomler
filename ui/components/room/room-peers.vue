<template>
  <div>
    <v-list three-line>
      <template v-for="(item, index) in roomPeers">
        <v-divider
          :key="`peer_${index}`"
          :inset="true"
        />

        <v-list-item
          :key="item.user._id"
        >
          <v-list-item-icon>
            <v-badge
              :color="isInCall(item.user._id) ? 'red' : isOnline(item.user._id) ? 'green' : 'grey'"
              bordered
              bottom
              left
              avatar
              overlap
              offset-x="10"
              offset-y="10"
            >
              <template v-if="isInCall(item.user._id)" #badge>
                <v-avatar v-if="isInCall(item.user._id)" size="12">
                  <v-icon size="7" style="margin-bottom: 6px">
                    fa fa-phone
                  </v-icon>
                </v-avatar>
              </template>

              <v-avatar
                size="36px"
              >
                <img v-if="item.user.avatar_url" :src="item.user.avatar_url">
                <v-icon v-if="!item.user.avatar_url">
                  fa-user
                </v-icon>
              </v-avatar>
            </v-badge>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.user.username" />
            <v-list-item-subtitle v-text="item.user.email" />
            <v-list-item-subtitle>
              <v-chip
                class="mt-2"
                tile
                outlined
                color="primary"
              >
                {{ $t(`comps.room.${item.role}`) }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action-text>
            <peer-menu
              :room="room"
              :user="item.user"
              :current-user="user"
              :role="item.role"
              :current-role="item.currentRole"
              @openTransfer="openTransfer"
              @openPeerDelete="openPeerDelete"
              @toMember="toMember"
              @toModerator="toModerator"
            />
          </v-list-item-action-text>
        </v-list-item>
      </template>
    </v-list>
    <v-tooltip v-if="contacts && contacts.length && canInvite" bottom left>
      <template #activator="{ on }">
        <v-btn
          v-if="contacts && contacts.length && canInvite"
          right
          :dark="!isDark"
          :light="isDark"
          class="ma-4"
          x-small
          fab
          @click="peerDialog = true"
          v-on="on"
        >
          <v-icon x-small>
            fa-plus
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('comps.room.addExisting') }}</span>
    </v-tooltip>
    <peer-dialog :dialog="peerDialog" :room="room" :peers="peers" @cancelPeers="cancelPeers" @addPeers="addPeers" />
    <ownership-dialog :dialog="transferDialog" :room="room" :user="selectedUser" @toOwner="toOwner" @transferCancel="transferCancel" />
    <peer-delete-dialog :dialog="peerDeleteDialog" :room="room" :user="selectedUser" @peerDelete="peerDelete" @peerDeleteCancel="peerDeleteCancel" />
  </div>
</template>

<script>

import PeerMenu from '@/components/invite/peer-menu'
import PeerDialog from '@/components/invite/peer-dialog'
import OwnershipDialog from '@/components/invite/ownership-dialog'
import PeerDeleteDialog from '@/components/invite/peer-delete-dialog'

export default {
  components: {
    PeerMenu,
    PeerDialog,
    OwnershipDialog,
    PeerDeleteDialog
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    },
    peers: {
      type: Array,
      default () {
        return []
      }
    },
    roomRoute: {
      type: String,
      default: null
    },
    roomQuery: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      selectedUser: null,
      peerDialog: false,
      transferDialog: false,
      peerDeleteDialog: false
    }
  },
  computed: {
    dialogStarter () {
      return {
        peers: this.roomRoute && this.roomRoute.startsWith('peers'),
        add: !!(this.roomQuery && (this.roomQuery.add === null || this.roomQuery.add === true))
      }
    },
    currentRole () {
      const role = this.room && this.user ? this.$store.getters['api/room/getUserRole'](this.room._id, this.user._id) : ''
      return role
    },
    canInvite () {
      const result = ['owner', 'moderator'].includes(this.currentRole)
      return result
    },
    roomPeers () {
      const self = this
      const users = this.$store.getters['api/auth/getRoomPeers'](this.room)
      return users
        .map(u => (
          {
            user: u,
            role: self.room ? self.$store.getters['api/room/getUserRole'](self.room._id, u._id) : '',
            currentRole: self.currentRole
          }))
        .sort((a, b) => {
          return a.user.username.localeCompare(b.user.username)
        })
    },
    contacts () {
      return this.roomPeers.filter(u => u._id !== this.user._id)
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  watch: {
    'dialogStarter' (value) {
      if (value.peers && value.add) {
        this.peerDialog = true
      }
    }
  },
  methods: {
    isOnline (userid) {
      return this.$store.getters['api/auth/isOnline'](userid)
    },
    isInCall (userid) {
      return this.$store.getters['api/room/calls/isUserInCall'](userid)
    },
    async addPeers (newPeers) {
      const room = newPeers[0].room
      const members = newPeers.filter(p => p.type === 'member').map(p => p.peer)
      const moderators = newPeers.filter(p => p.type === 'moderator').map(p => p.peer)
      await Promise.all(
        [
          !members.length || this.$store.dispatch('api/room/members/push', { room, users: members }),
          !moderators.length || this.$store.dispatch('api/room/moderators/push', { room, users: moderators })
        ]
      )
      this.peerDialog = false
      this.$router.push({ path: this.localePath({ name: 'room-peers', params: { room: `${this.room.path}` } }) })
    },
    cancelPeers () {
      this.peerDialog = false
      this.$router.push({ path: this.localePath({ name: 'room-peers', params: { room: `${this.room.path}` } }) })
    },
    openTransfer (user) {
      this.selectedUser = user
      this.transferDialog = true
    },
    transferCancel () {
      this.transferDialog = false
    },
    openPeerDelete (user) {
      this.selectedUser = user
      this.peerDeleteDialog = true
    },
    peerDeleteCancel () {
      this.peerDeleteDialog = false
    },
    async peerDelete (user) {
      const type = this.$store.getters['api/room/getUserRole'](this.room._id, user._id)
      await this.$store.dispatch(`api/room/${type}s/pull`, { room: this.room._id, user: user._id })
      this.peerDeleteDialog = false
    },
    async toOwner (user) {
      await this.$store.dispatch('api/room/owner/transfer', { room: this.room._id, user: user._id })
      this.transferDialog = false
    },
    async toModerator (user) {
      await this.$store.dispatch('api/room/moderators/switch', { room: this.room._id, user: user._id })
    },
    async toMember (user) {
      await this.$store.dispatch('api/room/members/switch', { room: this.room._id, user: user._id })
    }
  }
}
</script>

<style scoped>
* >>> .v-badge__badge {
  height: 12px;
  min-width: 12px;
  padding: 0px;
}
* >>> .v-badge--bordered .v-badge__badge::after {
  border-width: 1px;
}
</style>
