<template>
  <v-navigation-drawer
    ref="leftDrawer"
    v-model="leftDrawer"
    :width="width"
    :mobile-breakpoint="720"
    app
    clipped
    class="pr-1"
    :style="{background: $vuetify.theme.themes[theme].background}"
    mini
  >
    <nuxt-link v-show="conferenceRoom && roomRoute !== 'calls'" :to="conferenceRoom ? `/${conferenceRoom.path}/calls` : ''">
      <portal-target name="conference-left" />
    </nuxt-link>
    <v-expansion-panels
      v-model="panel"
      accordion
      tile
      class="pa-0 ma-0"
    >
      <v-expansion-panel v-show="conferenceRoom && roomRoute === 'calls'">
        <v-expansion-panel-header>
          <div>
            <v-icon>
              fa-comments
            </v-icon> &nbsp;
            <span style="font-weight: 500">CHAT - {{ conferenceRoom ? conferenceRoom.name.toUpperCase() : '' }}</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <portal-target name="chat-left" class="ml-1 mr-1" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div>
            <v-icon>
              account_tree
            </v-icon> &nbsp;
            <span style="font-weight: 500">ROOMS</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content :class="user && user._id && (!tree || !tree.items || !tree.items.length) ? 'pa-0 ma-0 mr-4' : 'pa-0 ma-0'">
          <v-btn
            v-if="user && user._id && (!tree || !tree.items || !tree.items.length)"
            to="/explore/rooms"
            dark
            block
            color="teal"
            class="ma-2"
          >
            <v-icon>fa fa-search</v-icon> &nbsp; Explore rooms
          </v-btn>
          <v-btn
            v-if="user && user._id && (!tree || !tree.items || !tree.items.length)"
            to="/@/room/create"
            dark
            block
            color="secondary"
            class="ma-2 pr-2"
          >
            <v-icon>fa fa-plus</v-icon> &nbsp; Create new room
          </v-btn>
          <v-treeview
            v-if="tree && tree.items && tree.items.length"
            v-model="modelList"
            :open="tree.open"
            :items="tree.items"
            hoverable
            activatable
            open-all
            dense
            item-key="path"
            item-text="short_name"
            class="pa-0 ma-0"
            @update:open="updateOpen"
          >
            <template v-slot:prepend="{ item, open }">
              <v-badge
                :color="mentions(item) ? 'red' : 'orange'"
                :value="unreads(item)"
                left
                bottom
                overlap
                class="align-self-center"
              >
                <template v-slot:badge>
                  <span>{{ unreads(item) }}</span>
                </template>
                <v-icon>
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
              </v-badge>
            </template>
            <template slot="label" slot-scope="{ item }">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :to="{ path: `/${item.path}` }"
                    dense
                    small
                    block
                    outlined
                    class="justify-start pr-0"
                    style="font-weight: 100;"
                    v-on="on"
                  >
                    <v-icon v-if="item.is_open" x-small class="justify-start">
                      fa-lock-open
                    </v-icon>
                    <v-icon v-if="!item.is_open" x-small class="justify-start">
                      fa-lock
                    </v-icon>
                    &nbsp;
                    <strong v-if="isRoomPeer(item)">{{ item.short_name }}</strong>
                    <em v-if="!isRoomPeer(item)">{{ item.short_name }}</em>
                    &nbsp;
                    <v-icon v-if="mentions(item)" small color="red">
                      fa-at
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ item.name.toUpperCase() }} ({{ item.is_open ? 'open: join allowed to everyone' : 'closed: invite only join' }})</span>
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <room-menu
                :room="item"
                :user="user"
                :peers="peers"
                @add="add"
                @edit="edit"
                @removeConsent="removeConsent"
                @join="join"
                @leaveConsent="leaveConsent"
              />
            </template>
          </v-treeview>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div>
            <v-icon>
              fa-users
            </v-icon> &nbsp;
            <span style="font-weight: 500">PEERS</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn
            v-if="(!peers || !peers.length) && tree && tree.items && tree.items.length"
            :to="`/${tree.items[0].path}/peers?invite`"
            dark
            block
            outlined
            class="primary"
          >
            <v-icon>fa-users</v-icon> &nbsp; Invite new peers
          </v-btn>
          <v-list
            v-if="peers && peers.length"
            dense
          >
            <v-list-item
              v-for="peer in peers"
              :key="peer._id"
              :to="`/@/${peer.username}`"
              link
            >
              <v-list-item-icon>
                <v-badge
                  :color="isInCall(peer._id) ? 'red' : isOnline(peer._id) ? 'green' : 'grey'"
                  bordered
                  bottom
                  left
                  avatar
                  overlap
                  offset-x="5"
                  offset-y="5"
                >
                  <template v-if="isInCall(peer._id)" v-slot:badge>
                    <v-avatar v-if="isInCall(peer._id)" size="12">
                      <v-icon size="7" style="margin-bottom: 6px">
                        fa fa-phone
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-avatar
                    size="32px"
                  >
                    <img v-if="peer.avatar_url" :src="peer.avatar_url">
                    <v-icon v-if="!peer.avatar_url">
                      fa-user
                    </v-icon>
                  </v-avatar>
                </v-badge>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ peer.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <room-delete-dialog
      :dialog="dialog.delete"
      :room="selectedRoom"
      @remove="remove"
      @removeCancel="removeCancel"
    />
    <room-leave-dialog
      :dialog="dialog.leave"
      :room="selectedRoom"
      :user="user"
      @leave="leave"
      @leaveCancel="leaveCancel"
    />
  </v-navigation-drawer>
</template>

<script>

import RoomDeleteDialog from './room/room-delete-dialog'
import RoomLeaveDialog from './room/room-leave-dialog'
import RoomMenu from './room/room-menu'

export default {
  components: {
    RoomDeleteDialog,
    RoomLeaveDialog,
    RoomMenu
  },
  props: {
    drawer: {
      type: Boolean,
      default: true
    },
    rooms: {
      type: Array,
      default: () => {
        return []
      }
    },
    peers: {
      type: Array,
      default: () => {
        return []
      }
    },
    tree: {
      type: Object,
      default: null
    },
    user: {
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
    roomRoute: {
      type: String,
      default: null
    }
  },
  data () {
    const config = this.$store.state.api.config.config
    let width = 280
    if (typeof window !== 'undefined' && window.innerWidth > 600 && window.innerWidth < 960) {
      width = 320
    }
    if (typeof window !== 'undefined' && window.innerWidth > 960 && window.innerWidth < 1264) {
      width = 360
    }
    if (typeof window !== 'undefined' && window.innerWidth > 1264) {
      width = 420
    }
    return {
      panel: 1,
      modelList: [],
      openList: [],
      leftDrawer: true,
      width,
      borderSize: 3,
      mini: false,
      config,
      dialog: {
        delete: false,
        leave: false
      },
      selectedRoom: null
    }
  },
  computed: {
    direction () {
      return !this.leftDrawer ? 'Open' : 'Closed'
    },
    panelChange () {
      return {
        conferenceRoom: this.conferenceRoom,
        roomRoute: this.roomRoute
      }
    },
    isDark () {
      return this.$vuetify.theme.dark
    },
    theme () {
      return this.$vuetify.theme.isDark ? 'dark' : 'light'
    }
  },
  watch: {
    drawer (value) {
      this.leftDrawer = value
    },
    leftDrawer (value) {
      if (value !== this.drawer) {
        this.$store.commit('panel/toggle', 'left')
      }
    },
    panelChange (value) {
      if (value.conferenceRoom && value.roomRoute === 'calls') {
        this.panel = 0
      } else {
        this.panel = 1
      }
    }
  },
  mounted () {
    this.setBorderWidth()
    this.setEvents()
  },
  methods: {
    isOnline (userid) {
      return this.$store.getters['api/auth/isOnline'](userid)
    },
    isInCall (userid) {
      return this.$store.getters['api/room/calls/isUserInCall'](userid)
    },
    updateOpen (newVal) {
      this.$store.commit('api/room/setOpen', newVal)
    },
    isRoomPeer (room) {
      return this.$store.getters['api/room/isRoomPeer'](room)
    },
    setBorderWidth () {
      const i = this.$refs.leftDrawer.$el.querySelector(
        '.v-navigation-drawer__border'
      )
      i.style.width = this.borderSize + 'px'
      i.style.cursor = 'ew-resize'
      i.style.backgroundColor = 'grey'
    },
    setEvents () {
      const minSize = this.borderSize
      const el = this.$refs.leftDrawer.$el
      const drawerBorder = el.querySelector('.v-navigation-drawer__border')
      const direction = el.classList.contains('v-navigation-drawer--right')
        ? 'right'
        : 'left'

      function resize (e) {
        document.body.style.cursor = 'ew-resize'
        const f =
          direction === 'right'
            ? document.body.scrollWidth - e.clientX
            : e.clientX
        el.style.width = f + 'px'
      }

      const downHandler = (e) => {
        if (e.offsetX < minSize) {
          el.style.transition = 'initial'
          document.addEventListener('mousemove', resize, false)
        }
      }

      const upHandler = (e) => {
        el.style.transition = ''
        this.width = el.style.width
        document.body.style.cursor = ''
        document.removeEventListener('mousemove', resize, false)
      }

      drawerBorder.addEventListener('mousedown', downHandler, false)
      document.addEventListener('mouseup', upHandler, false)
    },
    unreads (room) {
      return this.$store.getters['api/message/unreads'](room._id).length
    },
    mentions (room) {
      const userid = this._id
      return this.$store.getters['api/message/mentions'](room._id, userid).length
    },
    add (room) {
      this.$router.push({ path: `/@/room/create?parent=${room.path}` })
    },
    edit (room) {
      this.$router.push({ path: `/@/room/edit?room=${room.path}` })
    },
    goToConference (room) {
      this.$router.push({ path: `/${this.conferenceRoom.path}/calls` })
    },
    removeConsent (item) {
      this.dialog.delete = true
      this.selectedRoom = item
    },
    async remove (roomToDelete) {
      this.dialog.delete = false
      const { result: { room, children } } = await this.$store.dispatch('api/room/delete', roomToDelete._id)
      const all = [room, ...children]
      await Promise.all(all.map(r =>
        this.$store.dispatch('api/janus/videoroom/destroyRoom', {
          room: r.media.roomid,
          secret: r.media.secret,
          permanent: true
        })
      ))
      this.$router.push({ path: '/' })
    },
    removeCancel () {
      this.dialog.delete = false
      this.selectedRoom = null
    },
    async join (room, user) {
      await this.$store.dispatch('api/room/members/push', { room: room._id, user: user._id })
      await this.$store.dispatch('api/message/getAll', { room })
    },
    leaveConsent (item) {
      this.dialog.leave = true
      this.selectedRoom = item
    },
    async leave (room, user) {
      const type = this.$store.getters['api/room/getUserRole'](room._id, user._id)
      await this.$store.dispatch(`api/room/${type}s/pull`, { room: room._id, user: user._id })
      this.dialog.leave = false
    },
    leaveCancel () {
      this.dialog.leave = false
      this.selectedRoom = null
    },
    goToRoom (name) {
      this.$router.push({ path: `/${name}` })
    }
  }
}

</script>
<style scoped>
  * >>> .v-expansion-panel-content__wrap{
    margin: 0px !important;
    padding: 0px !important;
  }
  * >>> .v-navigation-drawer__content {
    /* overflow-y: hidden;
    overflow-x: hidden; */
    scrollbar-width: thin;
    scrollbar-color: grey white;
  }
  * >>> .v-badge__badge {
    height: 12px;
    min-width: 12px;
    padding: 0px;
  }
  * >>> .v-badge--bordered .v-badge__badge::after {
    border-width: 1px;
  }
</style>
