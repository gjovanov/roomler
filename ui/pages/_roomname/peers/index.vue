<template>
  <client-only>
    <v-expansion-panels
      v-model="panels"
      accordion
      multiple
    >
      <v-expansion-panel>
        <v-expansion-panel-header>Peers</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list three-line>
            <template v-for="(item, index) in members">
              <v-divider
                :key="`peer_${index}`"
                :inset="true"
              />

              <v-list-item
                :key="item.user._id"
              >
                <v-list-item-icon>
                  <v-badge
                    :color="isOnline(item.user._id) ? 'green' : 'grey'"
                    bordered
                    bottom
                    left
                    dot
                    offset-x="9"
                    offset-y="9"
                  >
                    <v-avatar
                      size="32px"
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
                      {{ item.role }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action-text>
                  <peer-menu
                    :room="room"
                    :user="item.user"
                    :current-user="currentUser"
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
          <v-btn
            v-if="peers && peers.length && canInvite"
            color="red"
            right
            class="ml-4"
            @click="peerDialog = true"
          >
            <v-icon>fa-users</v-icon> &nbsp; Add existing peers
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Invites</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <template v-for="(item, index) in invites">
              <v-divider
                v-if="canInvite"
                :key="`invite_${index}`"
                :inset="true"
              />

              <v-list-item
                v-if="canInvite"
                :key="item._id"
              >
                <v-list-item-avatar>
                  <v-icon>fa-user</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.email" />
                  <v-list-item-subtitle v-text="item.name" />
                  <v-list-item-action-text v-text="`${item.type} (${item.status})`" />
                </v-list-item-content>

                <v-list-item-action>
                  <invite-menu
                    :room="room"
                    :invite="item"
                    @toMember="changeTypeToMember"
                    @toModerator="changeTypeToModerator"
                  />
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
          <v-btn
            v-if="canInvite"
            color="primary"
            right
            class="ml-4"
            @click="inviteDialog = true"
          >
            <v-icon>fa-users</v-icon> &nbsp; Invite new peers
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <ownership-dialog :dialog="transferDialog" :room="room" :user="selectedUser" @toOwner="toOwner" @transferCancel="transferCancel" />
      <peer-delete-dialog :dialog="peerDeleteDialog" :room="room" :user="selectedUser" @peerDelete="peerDelete" @peerDeleteCancel="peerDeleteCancel" />
      <invite-dialog :dialog="inviteDialog" :room="room" @cancelInvites="cancelInvites" @sendInvites="sendInvites" />
      <peer-dialog :dialog="peerDialog" :room="room" @cancelPeers="cancelPeers" @addPeers="addPeers" />
    </v-expansion-panels>
  </client-only>
</template>

<script>

import InviteDialog from '@/components/invite/invite-dialog'
import InviteMenu from '@/components/invite/invite-menu'
import PeerDialog from '@/components/invite/peer-dialog'
import PeerMenu from '@/components/invite/peer-menu'
import OwnershipDialog from '@/components/invite/ownership-dialog'
import PeerDeleteDialog from '@/components/invite/peer-delete-dialog'

export default {
  middleware: 'authenticated',
  components: {
    InviteDialog,
    InviteMenu,
    PeerDialog,
    PeerMenu,
    OwnershipDialog,
    PeerDeleteDialog
  },
  data () {
    return {
      panels: [0, 1],
      selectedUser: null,
      inviteDialog: false,
      peerDialog: false,
      transferDialog: false,
      peerDeleteDialog: false
    }
  },
  computed: {
    room () {
      return this.$store.state.api.room.room
    },
    currentUser () {
      return this.$store.state.api.auth.user
    },
    currentRole () {
      return this.room && this.currentUser ? this.$store.getters['api/room/getUserRole'](this.room._id, this.currentUser._id) : ''
    },
    canInvite () {
      return ['owner', 'moderator'].includes(this.currentRole)
    },
    members () {
      const self = this
      const userids = this.room && this.room._id ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
      const users = this.$store.getters['api/auth/getUsers'](userids)
      return users.map(u => (
        {
          user: u,
          role: self.room ? self.$store.getters['api/room/getUserRole'](self.room._id, u._id) : '',
          currentRole: self.currentRole
        }))
    },
    invites () {
      return this.$store.state.api.invite.invites
    },
    peers () {
      return this.$store.getters['api/auth/getPeers']
    }
  },
  async created () {
    const selectedRoom = this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname)
    this.$store.commit('api/room/setRoom', selectedRoom, { root: true })
    await this.$store.dispatch('api/invite/getAll', this.room._id)
  },
  mounted () {
    if (this.$route.query.invite !== undefined) {
      this.inviteDialog = true
    }
    if (this.$route.query.add !== undefined) {
      this.peerDialog = true
    }
  },
  methods: {
    isOnline (userid) {
      return this.$store.getters['api/auth/isOnline'](userid)
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
    },
    async changeTypeToModerator (invite) {
      await this.$store.dispatch('api/invite/update', { id: invite._id, type: 'moderator' })
    },
    async changeTypeToMember (invite) {
      await this.$store.dispatch('api/invite/update', { id: invite._id, type: 'member' })
    },
    cancelInvites () {
      this.inviteDialog = false
      this.$router.push({ path: `/${this.room.path}/peers` })
    },
    cancelPeers () {
      this.peerDialog = false
      this.$router.push({ path: `/${this.room.path}/peers` })
    },
    async addPeers (peers) {
      const room = peers[0].room
      const members = peers.filter(p => p.type === 'member').map(p => p.peer)
      const moderators = peers.filter(p => p.type === 'moderator').map(p => p.peer)
      await Promise.all(
        [
          !members.length || this.$store.dispatch('api/room/members/push', { room, users: members }),
          !moderators.length || this.$store.dispatch('api/room/moderators/push', { room, users: moderators })
        ]
      )
      this.peerDialog = false
      this.$router.push({ path: `/${this.room.path}/peers` })
    },
    async sendInvites (invites) {
      await this.$store.dispatch('api/invite/create', invites)
      this.inviteDialog = false
      this.$router.push({ path: `/${this.room.path}/peers` })
    }
  }
}
</script>
