<template>
  <v-dialog v-model="dialog" persistent retain-focus max-width="800px">
    <v-card>
      <v-expansion-panels
        v-model="panel"
        accordion
        multiple
        tile
        flat
      >
        <v-expansion-panel>
          <v-expansion-panel-header>New peer</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form ref="newPeerForm" v-model="isValidNewPeer" lazy-validation>
              <v-autocomplete
                v-model="newPeer.peer"
                :rules="peerRules"
                :items="availablePeers"
                filled
                chips
                color="blue-grey lighten-2"
                label="Select"
                item-text="username"
                item-value="_id"
                validate-on-blur
                dense
                required
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="clear(data.item)"
                  >
                    <v-avatar left>
                      <v-img :src="data.item.avatar_url" />
                    </v-avatar>
                    {{ data.item.username }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content v-text="data.item" />
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img :src="data.item.avatar_url">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.username" />
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
              <v-spacer />
              <v-select
                v-model="newPeer.type"
                :items="types"
                no-data-text="Type"
                label="Type"
                outlined
                dense
              />
              <v-btn
                :disabled="!isValidNewPeer"
                color="primary"
                outlined
                class="justify-end"
                @click="push"
              >
                <v-icon>fa-plus</v-icon> Add peer
              </v-btn>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>New peers list</v-expansion-panel-header>
          <v-expansion-panel-content>
            <em v-if="!newPeers.length">
              Please add some peers in this list.
            </em>
            <v-form ref="peersForm" v-model="areValidPeers" lazy-validation>
              <v-row
                v-for="peer in newPeers"
                :key="peer.peer"
                justify="center"
                class="pt-0 pb-0"
              >
                <v-col
                  cols="12"
                  md="6"
                  class="pt-0 pb-0"
                >
                  <v-chip class="pl-2" style="width: 100%; height: 40px;">
                    <v-avatar left>
                      <v-img :src="getUser(peer.peer).avatar_url" />
                    </v-avatar>
                    {{ getUser(peer.peer).username }}
                  </v-chip>
                </v-col>
                <v-col
                  cols="12"
                  md="5"
                  class="pt-0 pb-0"
                >
                  <v-select
                    v-model="peer.type"
                    :items="types"
                    label="Type"
                    no-data-text="Type"
                    dense
                    outlined
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="1"
                  class="pt-0 pb-0"
                >
                  <v-btn
                    color="red"
                    fab
                    x-small
                    @click="pop(peer)"
                  >
                    <v-icon>fa-trash-alt</v-icon>
                  </v-btn>
                </v-col>
                <v-divider />
              </v-row>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-actions>
        <v-btn
          color="grey"
          outlined
          class="ma-3"
          @click="cancelPeers()"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!areValidPeers || !newPeers.length"
          color="primary"
          outlined
          class="ma-3"
          @click="addPeers()"
        >
          Add peers
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
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
    }
  },
  data () {
    const config = this.$store.state.api.config.config
    const defaultPeer = {
      room: this.room._id,
      peer: undefined,
      type: config.dataSettings.invite.defaults.type
    }
    const types = config.dataSettings.invite.types
    const newPeer = Object.assign({ }, defaultPeer)

    return {
      people: [],
      isValidNewPeer: true,
      areValidPeers: true,

      peerRules: [
        v => !!v || 'Peer is required'
      ],

      panel: [0, 1],
      defaultPeer,
      newPeer,
      types,
      newPeers: []
    }
  },
  computed: {
    availablePeers () {
      const peerids = this.newPeers.map(p => p.peer)
      return this.peers.filter(p =>
        !peerids.includes(p._id) &&
        this.room &&
        this.room.owner !== p._id &&
        !this.room.members.includes(p._id) &&
        !this.room.moderators.includes(p._id))
    }
  },
  watch: {
    room (newRoom) {
      if (newRoom && newRoom._id) {
        this.defaultPeer.room = newRoom._id
        this.newPeer.room = newRoom._id
        this.newPeers.forEach((p) => {
          p.room = newRoom._id
        })
      }
    }
  },
  methods: {
    getUser (userid) {
      return this.$store.getters['api/auth/getUser'](userid)
    },
    clear (peer) {
      this.newPeer.peer = null
    },
    cancelPeers () {
      this.$emit('cancelPeers')
      this.newPeers = []
    },
    push () {
      if (this.$refs.newPeerForm.validate()) {
        this.newPeers.push(this.newPeer)
        this.newPeer = Object.assign({ }, this.defaultPeer)
      }
    },
    pop (peer) {
      this.newPeers = this.newPeers.filter(i => i.peer !== peer.peer)
    },
    addPeers () {
      if (this.$refs.peersForm.validate()) {
        this.$emit('addPeers', this.newPeers)
        this.newPeers = []
      }
    }
  }
}
</script>
