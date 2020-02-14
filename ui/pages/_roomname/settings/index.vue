<template>
  <client-only>
    <v-layout>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          lg="8"
          md="12"
        >
          <h1>Settings</h1>
        </v-col>
      </v-row>
    </v-layout>
  </client-only>
</template>

<script>

export default {
  middleware: 'authenticated',
  data () {
    return {
    }
  },
  computed: {
    user () {
      return this.$store.state.api.auth.user
    },
    room () {
      return this.$store.state.api.room.room
    }
  },
  created () {
    this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname), { root: true })
  }
}
</script>
