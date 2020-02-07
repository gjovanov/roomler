<template>
  <client-only>
    <v-layout>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="12"
        >
          <v-list three-line>
            <v-subheader
              v-text="'Peers'"
            />

            <v-divider />
            <template v-for="(item, index) in members">
              <v-divider
                :key="`peer_${index}`"
                :inset="true"
              />

              <v-list-item
                :key="item.user._id"
              >
                <v-list-item-avatar>
                  <v-img :src="item.user.avatar_url" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.user.username" />
                  <v-list-item-subtitle v-text="item.user.email" />
                  <v-list-item-action-text v-text="item.role" />
                </v-list-item-content>

                <v-list-item-action>
                  <peer-menu :room="room" :user="item.user" :role="item.role" :currentRole="item.currentRole" @openTransfer="openTransfer" />
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-spacer />
            <v-subheader
              v-text="'Invites'"
            />
            <v-divider />
            <template v-for="(item, index) in invites">
              <v-divider
                :key="`invite_${index}`"
                :inset="true"
              />

              <v-list-item
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
                  <invite-menu :room="room" :invite="item" />
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
          <v-btn
            @click="inviteDialog = true"
            color="primary"
            right
            class="ml-4"
          >
            <v-icon>fa-users</v-icon> &nbsp; Invite peers
          </v-btn>
        </v-col>
      </v-row>
      <ownership-dialog :dialog="transferDialog" :room="room" :user="selectedUser" @toOwner="toOwner" @transferCancel="transferCancel" />
      <invite-dialog :dialog="inviteDialog" :room="room" @cancelInvites="cancelInvites" @sendInvites="sendInvites" />
    </v-layout>
  </client-only>
</template>

<script>

import InviteDialog from '@/components/invite/invite-dialog'
import InviteMenu from '@/components/invite/invite-menu'
import PeerMenu from '@/components/invite/peer-menu'
import OwnershipDialog from '@/components/invite/ownership-dialog'

export default {
  middleware: 'authenticated',
  components: {
    InviteDialog,
    InviteMenu,
    PeerMenu,
    OwnershipDialog
  },
  data () {
    return {
      recomputed: 1,
      invites: [],
      selectedUser: null,
      inviteDialog: false,
      transferDialog: false
    }
  },
  computed: {
    room () {
      return this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname)
    },
    members () {
      const self = this
      const userids = this.room && this.room._id ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
      const users = this.$store.getters['api/auth/getUsers'](userids)
      return users.map(u => (
        {
          user: u,
          role: self.$store.getters['api/room/getUserRole'](self.room._id, u._id),
          currentRole: self.$store.getters['api/room/getUserRole'](self.room._id, self.$store.state.api.auth.user._id)
        }))
    }
  },
  async created () {
    const response = await this.$store.dispatch('api/invite/getAll', this.room._id)
    if (!response.hasError) {
      this.invites = response.result
    }
  },
  mounted () {
    if (this.$route.query.invite !== undefined) {
      this.inviteDialog = true
    }
  },
  methods: {
    openTransfer (user) {
      this.selectedUser = user
      this.transferDialog = true
    },
    transferCancel () {
      this.transferDialog = false
    },
    async toOwner (user) {
      await this.$store.dispatch('api/room/owner/transfer', { room: this.room._id, user: user._id })
      this.recomputed++
      this.transferDialog = false
    },
    toModerator (user) {

    },
    toMember (user) {

    },
    cancelInvites () {
      this.inviteDialog = false
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
