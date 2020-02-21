<template>
  <v-navigation-drawer
    ref="leftDrawer"
    v-model="leftDrawer"
    :width="width"
    app
    clipped
    class="pr-1"
    style="background-color: #121212"
  >
    <v-expansion-panels
      v-model="panel"
      accordion
      tile
      class="pa-0 ma-0"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>Rooms</v-expansion-panel-header>
        <v-expansion-panel-content class="pa-0 ma-0">
          <v-btn
            v-if="!tree || !tree.items || !tree.items.length"
            to="/@/room/create"
            dark
            block
            outlined
            class="red"
          >
            <v-icon>fa-comment</v-icon> &nbsp; Create a room
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
                    class="justify-space-between pr-0"
                    v-on="on"
                  >
                    <strong v-if="isRoomPeer(item)">{{ item.short_name }}</strong>
                    <em v-if="!isRoomPeer(item)">{{ item.short_name }}</em>
                    <v-icon v-if="mentions(item)" small color="red">
                      fa-at
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ item.name }}</span>
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <room-menu
                :room="item"
                :user="user"
                @add="add"
                @removeConsent="removeConsent"
                @join="join"
                @leaveConsent="leaveConsent"
              />
            </template>
          </v-treeview>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Peers</v-expansion-panel-header>
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
              :href="`/@/${peer.username}`"
              link
            >
              <v-list-item-icon>
                <v-badge
                  :color="isOnline(peer._id) ? 'green' : 'grey'"
                  bordered
                  bottom
                  left
                  dot
                  offset-x="4"
                  offset-y="4"
                >
                  <v-avatar
                    size="36px"
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
    }
  },
  data () {
    const config = this.$store.state.api.config.config
    return {
      panel: 0,
      modelList: [],
      openList: [],
      leftDrawer: true,
      width: 280,
      borderSize: 5,
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
    tree () {
      return this.$store.state.api.room.tree
    },
    user () {
      return this.$store.state.api.auth.user
    },
    peers () {
      return this.$store.getters['api/auth/getPeers']
    },
    direction () {
      return !this.leftDrawer ? 'Open' : 'Closed'
    }
  },
  watch: {
    drawer (value) {
      this.leftDrawer = value
    },
    leftDrawer (value) {
      this.$emit('toggleDrawer', value)
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
      i.style.backgroundColor = 'black'
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
      return this.$store.getters['api/message/unreads'](room.path).length
    },
    mentions (room) {
      const userid = this._id
      return this.$store.getters['api/message/mentions'](room.path, userid).length
    },
    add (item) {
      this.$router.push({ path: `/@/room/create?parent=${item.path}` })
    },
    removeConsent (item) {
      // eslint-disable-next-line no-debugger
      debugger
      this.dialog.delete = true
      this.selectedRoom = item
    },
    async remove (room) {
      // eslint-disable-next-line no-debugger
      debugger
      this.dialog.delete = false
      await this.$store.dispatch('api/janus/videoroom/destroyRoom', {
        room: room.media.roomid,
        secret: room.media.secret,
        permanent: true
      })
      await this.$store.dispatch('api/room/delete', room._id)
      this.$router.push({ path: '/' })
    },
    removeCancel () {
      this.dialog.delete = false
      this.selectedRoom = null
    },
    async join (room, user) {
      await this.$store.dispatch('api/room/members/push', { room: room._id, user: user._id })
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
</style>
