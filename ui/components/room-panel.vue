<template>
  <v-container fluid class="pa-0 ma-0">
    <v-row v-if="room && room._id">
      <v-col cols="12" class="pa-0 ma-0">
        <room-navigation
          :room="room"
          :conference-room="conferenceRoom"
        />
      </v-col>
    </v-row>
    <v-row v-if="room && room._id">
      <v-col cols="12" class="pt-0">
        <v-expansion-panels
          v-model="panels"
          accordion
          multiple
          style="height: 100%"
        >
          <v-expansion-panel v-if="room && !isRoomPeer && roomRoute === 'chat'">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-sign-in-alt
                </v-icon> &nbsp;
                <span>JOIN THIS ROOM - {{ room && room.name ? room.name.toUpperCase() : '' }}</span>
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
                  <v-btn dark block outlined class="red" @click="join()">
                    <v-icon>fa-users</v-icon> &nbsp; Join
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="room && isRoomPeer && roomPeers && roomPeers.length === 1 && roomRoute === 'chat'">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-paper-plane
                </v-icon> &nbsp;
                <span>INVITE</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                v-if="roomPeers && roomPeers.length === 1"
                dense
                align="center"
                justify="center"
              >
                <v-col
                  cols="12"
                  sm="4"
                  md="3"
                >
                  <room-invite :room="room" :peers="peers" />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="room && isRoomPeer && roomPeers && roomPeers.length >= 0 && roomRoute === 'calls'">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-phone
                </v-icon> &nbsp;
                <span>CONFERENCE - {{ room ? room.name.toUpperCase() : '' }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <conference-navigation
                :user="user"
                :room="room"
                :conference-session="conferenceSession"
                :conference-room="conferenceRoom"
              />
              <conference
                :user="user"
                :room="room"
                :peers="peers"
                :conference-session="conferenceSession"
                :conference-room="conferenceRoom"
                :conference-position="conferencePosition"
              />
              <portal-target name="conference-center" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="room && isRoomPeer && roomPeers && roomPeers.length >= 0 && (roomRoute === 'chat' || roomRoute === 'calls')">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-comments
                </v-icon> &nbsp;
                <span>CHAT - {{ room ? room.name.toUpperCase() : '' }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <chat
                :name="'center'"
                :user="user"
                :room="room"
              />
              <chat
                :name="'conference'"
                :user="user"
                :room="conferenceRoom"
              />
              <portal-target name="chat-center" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="room && roomRoute === 'peers'">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-users
                </v-icon> &nbsp;
                <span>PEERS</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="justify-center">
              <room-peers :room="room" :user="user" :peers="peers" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="room && roomRoute === 'peers'">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-users
                </v-icon> &nbsp;
                <span>INVITES</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="justify-center">
              <room-invites :room="room" :user="user" :invites="invites" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="room && roomRoute === 'settings'">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-info
                </v-icon> &nbsp;
                <span>BASIC INFO</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <room-basic-info :room="room" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="room && roomRoute === 'settings'">
            <v-expansion-panel-header>
              <div>
                <v-icon>
                  fa-sliders-h
                </v-icon> &nbsp;
                <span>MEDIA</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <room-media :user="user" :room="room" />
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
      panels: [0]
    }
  },
  computed: {
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    },
    isRoomPeer () {
      return this.$store.getters['api/room/isRoomPeer'](this.room)
    }
  },
  methods: {
    async join () {
      await this.$store.dispatch('api/room/members/push', { room: this.room._id, user: this.user._id })
      await this.$store.dispatch('api/message/getAll', { room: this.room })
    }
  }
}
</script>
