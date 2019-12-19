<template>
  <v-container fluid>
    <v-layout>
      &nbsp;
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    room () {
      return this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname)
    },
    members () {
      const users = this.room ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
      return users
    },
    messages () {
      const roomname = this.$route.params.roomname.toLowerCase()
      return this.$store.getters['api/message/dailyMessages'](roomname)
    },
    unreads () {
      const roomname = this.$route.params.roomname.toLowerCase()
      return this.$store.getters['api/message/unreads'](roomname)
    }
  },
  mounted () {

  }
}
</script>
