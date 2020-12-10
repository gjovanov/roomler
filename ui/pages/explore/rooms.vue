<template>
  <v-container fluid style="height: 100%">
    <v-row>
      <v-col cols="12" sm="12">
        <v-text-field
          v-model="search"
          :label="$t('pages.explore.rooms.searchLabel')"
          name="search-room"
          autocomplete="on"
          class="pt-0 mt-0"
          full-width
          required
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(room, index) in rooms"
        :key="`room-${room.name}-${index}`"
        cols="12"
        sm="12"
        md="6"
        lg="4"
      >
        <v-card
          class="ma-1"
          elevation="12"
          height="200px"
        >
          <v-card-title>{{ room.name }}</v-card-title>
          <v-card-text>
            <em>{{ room.description || $t('pages.explore.rooms.description') }}</em>

            <v-chip-group
              v-model="room.selection"
              mandatory
              style="height: 48px"
            >
              <template
                v-for="(tag, index2) in getRoomTags(room)"
              >
                <v-chip
                  :key="`tag-${tag}-${index2}`"
                  :to="localePath({ name: 'explore-rooms', query: { search: `${tag}` } })"
                  outlined
                  small
                  color="primary"
                >
                  {{ tag }}
                </v-chip>
              </template>
            </v-chip-group>
          </v-card-text>
          <v-card-actions class="d-flex flex-row justify-space-between">
            <v-chip
              outlined
              small
              class="grey"
            >
              <v-icon small>
                fa-users
              </v-icon> &nbsp; {{ room.members.length + room.moderators.length + 1 }}
            </v-chip>
            <v-btn
              v-if="!isRoomPeer(room)"
              tile
              small
              :dark="!isDark"
              :light="isDark"
              @click="join(room)"
            >
              <v-icon small>
                fa-sign-in-alt
              </v-icon> &nbsp; {{ $t('pages.explore.rooms.join') }}
            </v-btn>
            <v-btn
              v-if="isRoomPeer(room)"
              tile
              small
              :dark="!isDark"
              :light="isDark"
              :to="localePath({ name: 'room-chat', params: { room: `${room.path}` } })"
            >
              <v-icon small>
                fa-eye
              </v-icon> &nbsp; {{ $t('pages.explore.rooms.visit') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-pagination
          v-model="page"
          :length="count"
          :total-visible="5"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData ({ store, query }) {
    const search = query.search || ''
    const page = query.page || 1
    const size = query.size || 6
    const response = await store.dispatch('api/room/explore', { search, page: page - 1, size })
    return { rooms: response.result.data, count: Math.ceil(parseFloat(response.result.count) / size) }
  },
  data () {
    const page = this.$route.query.page !== undefined ? parseInt(this.$route.query.page) : 1
    return {
      search: this.$route.query.search || '',
      timeDuration: 200,
      timeout: null,
      page,
      size: 6,
      count: 0,
      rooms: []
    }
  },
  computed: {
    user () {
      return this.$store.state.api.auth.user
    },
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  watch: {
    search (newVal) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.$router.push({ path: this.$route.path, query: { search: newVal, page: 1 } })
      }, this.timeDuration)
    },
    page (newVal) {
      this.$router.push({ path: this.$route.path, query: { search: this.search, page: newVal } })
    },
    size (newVal) {
      this.$route.query.size = newVal
    }
  },
  watchQuery: ['search', 'page', 'size'],
  methods: {
    isRoomPeer (room) {
      return this.$store.getters['api/room/isRoomPeer'](room)
    },
    getRoomTags (room) {
      return room.tags.length ? room.tags : []
    },
    async join (room) {
      if (this.user && this.user._id) {
        try {
          await this.$store.dispatch('api/room/members/push', { room: room._id, user: this.user._id })
          await Promise.all([
            this.$store.dispatch('api/room/getAll'),
            this.$store.dispatch('api/auth/getPeers'),
            this.$store.dispatch('api/message/getAll', { room })
          ])
          this.$store.commit('api/room/open', room, { root: true })
          this.$router.push({ path: this.localePath({ name: 'room-chat', params: { room: `${room.path}` } }) })
        } catch (e) {
          // will be handled by the individal AJAX, so we want to only stay on the same page (not navigate away)
        }
      } else {
        this.$router.push({ path: this.localePath({ name: '--auth-login' }) })
      }
    }
  }
}
</script>
