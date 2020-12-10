<template>
  <v-container
    fluid
    class="pa-0 ma-0"
    style="height: 100%"
  >
    <v-row v-show="room && room._id">
      <v-col cols="12" class="pa-0 ma-0">
        <room-navigation
          :room="room"
          :room-route="roomRoute"
        />
      </v-col>
    </v-row>
    <v-row v-show="room && room._id">
      <v-col cols="12" class="pt-0">
        <v-expansion-panels
          v-model="panels"
          accordion
          style="height: 100%"
        >
          <v-expansion-panel v-show="joinPanel">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-sign-in-alt
                </v-icon> &nbsp;
                <span class="text-uppercase" style="font-weight: 500">{{ $t('comps.room.joinThisRoom') }}: {{ room && room.name ? room.name : '' }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                dense
                align="center"
                justify="center"
              >
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-btn
                    dark
                    block
                    outlined
                    class="secondary"
                    @click="join()"
                  >
                    <v-icon>fa-users</v-icon> &nbsp; {{ $t('comps.room.join') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="invitePanel">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-paper-plane
                </v-icon> &nbsp;
                <span class="text-uppercase" style="font-weight: 500">{{ $t('comps.room.invite') }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                v-show="roomPeers && roomPeers.length === 1"
                dense
                align="center"
                justify="center"
              >
                <v-col
                  cols="12"
                  sm="8"
                  md="6"
                  lg="4"
                >
                  <room-invite :room="room" :peers="peers" />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="callsPanel">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-phone
                </v-icon> &nbsp;
                <span class="text-uppercase" style="font-weight: 500">{{ $t('comps.room.conference') }} - {{ conferenceRoom ? conferenceRoom.name : room ? room.name : '' }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <conference-navigation
                :user="user"
                :room="room"
                :conference-session="conferenceSession"
                :conference-room="conferenceRoom"
                :room-route="roomRoute"
              />
              <conference
                :user="user"
                :room="room"
                :peers="peers"
                :conference-session="conferenceSession"
                :conference-room="conferenceRoom"
                :room-route="roomRoute"
              />
              <chat
                :name="'conference'"
                :user="user"
                :room="conferenceRoom"
                :room-route="roomRoute"
                :is-chat-panel="isChatPanel"
              />
              <portal-target name="conference-center" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="chatPanel">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-comments
                </v-icon> &nbsp;
                <span class="text-uppercase" style="font-weight: 500">{{ $t('comps.room.chat') }} - {{ room ? room.name : '' }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <chat
                :name="'center'"
                :user="user"
                :room="room"
                :room-route="roomRoute"
                :is-chat-panel="isChatPanel"
              />
              <portal-target name="chat-center" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="peersPanel">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-users
                </v-icon> &nbsp;
                <span class="text-uppercase" style="font-weight: 500">{{ $t('comps.room.participants') }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="justify-center">
              <room-peers
                :room="room"
                :user="user"
                :peers="peers"
                :room-route="roomRoute"
                :room-query="roomQuery"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="invitesVisible">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-paper-plane
                </v-icon> &nbsp;
                <span class="text-uppercase" style="font-weight: 500">{{ $t('comps.room.invites') }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="justify-center">
              <room-invites
                :room="room"
                :user="user"
                :invites="invites"
                :room-route="roomRoute"
                :room-query="roomQuery"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="settingsPanel">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-info
                </v-icon> &nbsp;
                <span class="text-uppercase" style="font-weight: 500">{{ $t('comps.room.basicInfo') }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <room-basic-info
                :room="room"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="settingsPanel">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-sliders-h
                </v-icon> &nbsp;
                <span class="text-uppercase" style="font-weight: 500">{{ $t('comps.room.media') }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <room-media
                :user="user"
                :room="room"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RoomNavigation from '@/components/room/room-navigation'
import RoomInvite from '@/components/room/room-invite'
import RoomInvites from '@/components/room/room-invites'
import RoomPeers from '@/components/room/room-peers'
import RoomBasicInfo from '@/components/room/room-basic-info'
import RoomMedia from '@/components/room/room-media'
import Chat from '@/components/chat/chat'
import Conference from '@/components/conference/conference'
import ConferenceNavigation from '@/components/conference/conference-navigation'

export default {
  components: {
    RoomNavigation,
    RoomInvite,
    RoomInvites,
    RoomPeers,
    RoomBasicInfo,
    RoomMedia,
    Chat,
    Conference,
    ConferenceNavigation
  },
  props: {
    rooms: {
      type: Array,
      default () {
        return []
      }
    },
    peers: {
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
    },
    conferenceSession: {
      type: Object,
      default: null
    },
    conferenceRoom: {
      type: Object,
      default: null
    },
    conferencePosition: {
      type: String,
      default: null
    },
    invites: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      panels: 0
    }
  },
  computed: {
    joinPanel () {
      return this.room && !this.isRoomPeer && this.roomRoute && this.roomRoute.startsWith('chat')
    },
    invitePanel () {
      return this.room && this.isRoomPeer && this.roomPeers && this.roomPeers.length === 1 && this.roomRoute && this.roomRoute.startsWith('chat')
    },
    callsPanel () {
      return this.room && this.isRoomPeer && this.roomPeers && this.roomPeers.length >= 0 && this.roomRoute && this.roomRoute.startsWith('calls')
    },
    chatPanel () {
      return this.room && this.isRoomPeer && this.roomPeers && this.roomPeers.length >= 0 && this.roomRoute && this.roomRoute.startsWith('chat')
    },
    peersPanel () {
      return this.room && this.roomRoute && this.roomRoute.startsWith('peers')
    },
    invitesVisible () {
      const userRole = this.$store.getters['api/room/getUserRole'](this.room ? this.room._id : null, this.user ? this.user._id : null)
      return this.peersPanel &&
        ['owner', 'moderator'].includes(userRole)
    },
    invitesPanel () {
      return this.peersPanel && (
        this.roomQuery.invite === null ||
        this.roomQuery.invite === true ||
        this.roomQuery.link === null ||
        this.roomQuery.link === true)
    },
    settingsPanel () {
      return this.room && this.roomRoute && this.roomRoute.startsWith('settings')
    },
    panel () {
      if (this.joinPanel) {
        return 0
      } else if (this.invitePanel) {
        return 1
      } else if (this.callsPanel) {
        return 2
      } else if (this.chatPanel) {
        return 3
      } else if (this.invitesPanel) {
        return 5
      } else if (this.peersPanel) {
        return 4
      } else if (this.settingsPanel) {
        return 6
      }
      return 0
    },
    isChatPanel () {
      return this.chatPanel && this.panels === 3
    },
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    },
    isRoomPeer () {
      return this.$store.getters['api/room/isRoomPeer'](this.room)
    }
  },
  watch: {
    'panel' (newVal) {
      this.panels = newVal
    },
    'panels' (newVal) {
    // load invites
      if (newVal === 5) {
        this.$store.dispatch('api/invite/getAll', this.room._id)
      }
    }
  },
  methods: {
    async join () {
      await this.$store.dispatch('api/room/members/push', { room: this.room._id, user: this.user._id })
      await Promise.all([
        this.$store.dispatch('api/auth/getPeers'),
        this.$store.dispatch('api/message/getAll', { room: this.room })
      ])
      this.$store.commit('api/room/open', this.room, { root: true })
    }
  }
}
</script>
