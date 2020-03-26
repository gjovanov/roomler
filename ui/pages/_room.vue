<template>
  <client-only>
    <v-container fluid class="pa-0 ma-0">
      <v-row>
        <v-col cols="12" class="pa-0 ma-0">
          <room-navigation
            :room="room"
            :conference-room="conferenceRoom"
          />
        </v-col>
      </v-row>
      <v-row>
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
  middleware: 'authenticated',
  components: {
    RoomNavigation
  },
  computed: {
    room () {
      return this.$store.state.api.room.room
    },
    session () {
      return this.$store.state.api.conference.session
    },
    conferenceRoom () {
      return this.$store.state.api.conference.room
    }
  },
  async mounted () {
    await this.$store.dispatch('api/room/get', this.$route.params.room)
  },
  beforeRouteLeave (to, from, next) {
    if (this.session) {
      const answer = window.confirm('Do you really want to leave from the conference? If you select "OK" you will get disconnected!')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next(true)
    }
  }
}
</script>
