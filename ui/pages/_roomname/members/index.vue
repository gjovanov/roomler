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
              v-text="'Members'"
            />

            <v-divider />
            <template v-for="(item, index) in members">
              <v-divider
                :key="`member_${index}`"
                :inset="true"
              />

              <v-list-item
                :key="item._id"
              >
                <v-list-item-avatar>
                  <v-img :src="item.avatar_url" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.username" />
                  <v-list-item-subtitle v-text="item.email" />
                  <v-list-item-action-text v-text="item.role" />
                </v-list-item-content>

                <v-list-item-action>
                  <member-menu :user="item" />
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
                  <invite-menu :invite="item" />
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
      <invite-dialog :dialog="inviteDialog" :room="room" @cancelInvites="cancelInvites" @sendInvites="sendInvites" />
    </v-layout>
  </client-only>
</template>

<script>

import InviteDialog from '@/components/invite/invite-dialog'
import InviteMenu from '@/components/invite/invite-menu'
import MemberMenu from '@/components/invite/member-menu'

export default {
  middleware: 'authenticated',
  components: {
    InviteDialog,
    InviteMenu,
    MemberMenu
  },
  data () {
    return {
      invites: [],
      inviteDialog: false
    }
  },
  computed: {
    room () {
      return this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname)
    },
    members () {
      const userids = this.room && this.room._id ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
      const users = this.$store.getters['api/auth/getUsers'](userids)
      return users
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
    cancelInvites () {
      this.inviteDialog = false
      this.$router.push({ path: `/${this.room.path}/members` })
    },
    async sendInvites (invites) {
      await this.$store.dispatch('api/invite/create', invites)
      this.inviteDialog = false
      this.$router.push({ path: `/${this.room.path}/members` })
    }
  }
}
</script>
