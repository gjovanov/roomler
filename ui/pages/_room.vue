<template>
  <client-only>
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
          <nuxt-child />
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>

<script>
import RoomNavigation from '@/components/room/room-navigation'
export default {
  components: {
    RoomNavigation
  },
  computed: {
    room () {
      return this.$store.state.api.room.room
    },
    user () {
      return this.$store.state.api.auth.user
    },
    session () {
      return this.$store.state.api.conference.session
    },
    conferenceRoom () {
      return this.$store.state.api.conference.room
    }
  },
  created () {
    this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](this.$route.params.room), { root: true })
  },
  async mounted () {
    if (!this.room || !this.room._id) {
      await this.$store.dispatch('api/room/get', this.$route.params.room)
    }
    if (!this.room || !this.room._id) {
      return this.$router.push({ path: '/' })
    }
    const type = ((this.$route.name === 'room-join')
      ? (this.$route.query.moderator !== undefined ? 'moderator' : 'member') : null)
    const join = this.room && this.room._id && type ? `${this.room._id}|${type}` : ''

    if (join) {
      this.$store.commit('api/invite/storePendingJoins', join, {
        root: true
      })
    }
    if (!this.user || !this.user._id) {
      const toast = {
        prop: 'global',
        message: 'Unauthorized: Please login or register before you can join any Room',
        error: true
      }
      this.$store.commit('toast/push', toast, {
        root: true
      })
      return this.$router.push({ path: '/@/auth/login' })
    }
    await this.$store.dispatch('api/invite/acceptPendingJoins', this.user._id)
    if (join) {
      return this.$router.push({ path: `/${this.room.path}/chat` })
    }
  }
}
</script>
