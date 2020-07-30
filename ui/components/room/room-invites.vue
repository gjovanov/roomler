<template>
  <div>
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
            <v-list-item-action-text>
              <v-chip
                class="mt-2"
                tile
                outlined
                color="primary"
              >
                {{ item.type }}
              </v-chip> {{ `(${item.status})` }}
            </v-list-item-action-text>
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
    <v-tooltip v-if="canInvite" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="canInvite"
          right
          x-small
          :dark="!isDark"
          :light="isDark"
          fab
          class="mt-4 ml-4 mr-4 mb-12"
          @click="inviteDialog = true"
          v-on="on"
        >
          <v-icon x-small>
            fa-paper-plane
          </v-icon>
        </v-btn>
      </template>
      <span>Invite new peers</span>
    </v-tooltip>

    <v-tooltip v-if="room && room.is_open && canInvite" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="canInvite"
          right
          x-small
          :dark="!isDark"
          :light="isDark"
          fab
          class="mt-4 ml-4 mr-4 mb-12"
          @click="linkDialog = true"
          v-on="on"
        >
          <v-icon x-small>
            fa-link
          </v-icon>
        </v-btn>
      </template>
      <span>Share room link</span>
    </v-tooltip>
    <invite-dialog :dialog="inviteDialog" :room="room" @cancelInvites="cancelInvites" @sendInvites="sendInvites" />
    <link-dialog :dialog="linkDialog" :room="room" @close="linkDialog = false" />
  </div>
</template>

<script>
import InviteDialog from '@/components/invite/invite-dialog'
import LinkDialog from '@/components/invite/link-dialog'
import InviteMenu from '@/components/invite/invite-menu'

export default {
  components: {
    InviteDialog,
    LinkDialog,
    InviteMenu
  },
  props: {
    invites: {
      type: Array,
      default () {
        return []
      }
    },
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
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
      inviteDialog: false,
      linkDialog: false
    }
  },
  computed: {
    dialogStarter () {
      return {
        peers: this.roomRoute === 'peers',
        invite: !!(this.roomQuery && (this.roomQuery.invite === null || this.roomQuery.invite === true)),
        link: !!(this.roomQuery && (this.roomQuery.link === null || this.roomQuery.link === true))
      }
    },
    canInvite () {
      return ['owner', 'moderator'].includes(this.currentRole)
    },
    currentRole () {
      return this.room && this.user ? this.$store.getters['api/room/getUserRole'](this.room._id, this.user._id) : ''
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  watch: {
    'dialogStarter' (value) {
      if (value.peers && value.invite) {
        this.inviteDialog = true
      }
      if (value.peers && value.link) {
        this.linkDialog = true
      }
    }
  },
  methods: {
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
    async sendInvites (invites) {
      await this.$store.dispatch('api/invite/create', invites)
      this.inviteDialog = false
      this.$router.push({ path: `/${this.room.path}/peers` })
    }
  }
}
</script>
