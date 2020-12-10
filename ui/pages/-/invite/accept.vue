<template>
  <div>
    &nbsp;
  </div>
</template>
<script>
export default {
  async mounted () {
    const self = this
    const invite = this.$route.query.invite
    this.$store.commit('api/invite/storePendingInvites', invite, {
      root: true
    })
    if (this.$store.getters['api/auth/isAuthenticated']) {
      await this.$store.dispatch('api/invite/acceptPendingInvites')
      await Promise.all([this.$store.dispatch('api/room/getAll'), this.$store.dispatch('api/auth/getPeers')])
        .then((data) => {
          if (data && data[0] && data[0].result && data[0].result.rooms) {
            return Promise.all(data[0].result.rooms.map(room => self.$store.dispatch('api/message/getAll', { room })))
          }
        })
      if (this.$store.state.api.room.rooms && this.$store.state.api.room.rooms.length) {
        const room = this.$store.state.api.room.rooms[0]
        this.$router.push({ path: this.localePath({ name: 'room-chat', params: { room: `${room.path}` } }) })
      }
    } else {
      this.$router.push({ path: this.localePath({ name: '--auth-login' }) })
    }
  }

}
</script>
