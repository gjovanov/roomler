<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12">
        <h3>Explore public rooms</h3>
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
                  color="primary"
                >
                  {{ tag }}
                </v-chip>
              </template>
            </v-chip-group>
            <h4>{{ room.description|| 'Description N/A' }}</h4>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!isRoomPeer(room)"
              absolute
              bottom
              left
              outlined
              class="red"
              @click="join(room)"
            >
              <v-icon>fa-sign-in-alt</v-icon> &nbsp; Join
            </v-btn>
            <v-btn
              absolute
              bottom
              right
              outlined
              disabled
              class="grey"
            >
              <v-icon>fa-users</v-icon> &nbsp; {{ room.members.length + room.moderators.length + 1 }}
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
    const page = query.page || 1
    const size = query.size || 6
    console.log(`Async data: page=${page} and size=${size}`)
    const response = await store.dispatch('api/room/explore', { page: page - 1, size })
    return { rooms: response.result.data, count: Math.ceil(parseFloat(response.result.count) / size) }
  },
  data () {
    return {
      page: this.$route.query.page || 1,
      size: 6,
      count: 0,
      rooms: []
    }
  },
  computed: {
    user () {
      return this.$store.state.api.auth.user
    }
  },
  watch: {
    page (newVal) {
      console.log(this.$route.query)
      console.log(`New page: ${newVal}`)
      this.$router.push({ path: this.$route.path, query: { page: newVal } })
    },
    size (newVal) {
      this.$route.query.size = newVal
    }
  },
  watchQuery: ['page', 'size'],
  methods: {
    isRoomPeer (room) {
      return this.$store.getters['api/room/isRoomPeer'](room)
    },
    getRoomTags (room) {
      return room.tags.length ? room.tags : ['One', 'Two', 'Three']
    },
    async join (room) {
      if (this.user && this.user._id) {
        await this.$store.dispatch('api/room/members/push', { room: room._id, user: this.user._id })
        await this.$store.dispatch('api/message/getAll', { room })
        this.$router.push({ path: `/${room.path}` })
      } else {
        this.$router.push({ path: '/@/auth/login' })
      }
    }
  }
}
</script>
