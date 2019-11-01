<template>
  <v-navigation-drawer
    v-model="leftDrawer"
    app
    clipped
    :width="325"
  >
    <v-subheader class="mt-4 grey--text text--darken-1">
      Rooms
    </v-subheader>
    <v-treeview
      v-model="roomTree.model"
      :open="roomTree.open"
      :items="roomTree.source.root"
      hoverable
      activatable
      open-all
      dense
      item-key="name"
      item-text="short_name"
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon>
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
      </template>
      <template slot="label" slot-scope="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn :to="{ path: `/${item.path}` }" block outlined class="justify-start" v-on="on">
              {{ '#' + item.short_name }}
            </v-btn>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
      </template>
      <template v-slot:append="{ item, open }">
        <room-menu :room="item" @add="add" @removeConsent="removeConsent" @remove="remove" />
      </template>
    </v-treeview>
    <room-delete-dialog :dialog="dialog" :room="selectedRoom" @remove="remove" @removeCancel="removeCancel" />
  </v-navigation-drawer>
</template>

<script>

import RoomDeleteDialog from './room/room-delete'
import RoomMenu from './room/room-menu'

export default {
  components: {
    RoomDeleteDialog,
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
      leftDrawer: true,
      mini: false,
      config,
      dialog: false,
      selectedRoom: null
    }
  },
  computed: {
    roomTree () {
      return this.$store.getters['api/room/tree']
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
  methods: {
    add (item) {
      this.$router.push({ path: `/@/room/create?parent=${item.path}` })
    },
    removeConsent (item) {
      this.dialog = true
      this.selectedRoom = item
    },
    async remove (room) {
      this.dialog = false
      await this.$store.dispatch('janus/destroyRoom', {
        plugin: this.config.janusSettings.plugins.videoroom,
        roomid: room.media.roomid,
        secret: room.media.secret
      })
      await this.$store.dispatch('api/room/delete', room._id)
      this.$router.push({ path: '/' })
    },
    removeCancel (roomid) {
      this.dialog = false
      this.selectedRoom = null
    },
    goToRoom (name) {
      this.$router.push({ path: `/${name}` })
    }
  }
}

</script>
