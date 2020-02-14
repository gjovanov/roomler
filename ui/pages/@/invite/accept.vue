<template>
  <div>
    &nbsp;
  </div>
</template>
<script>
export default {
  async mounted () {
    const invite = this.$route.query.invite
    this.$store.commit('api/invite/storePendingInvites', invite, {
      root: true
    })
    if (this.$store.getters['api/auth/isAuthenticated']) {
      await this.$store.dispatch('api/invite/acceptPendingInvites')
      await Promise.all([this.$store.dispatch('api/room/getAll'), this.$store.dispatch('api/auth/getPeers')])
      if (this.$store.state.api.room.rooms && this.$store.state.api.room.rooms.length) {
        const room = this.$store.state.api.room.rooms[0]
        this.$router.push({ path: `/${room.path}` })
      }
    } else {
      this.$router.push({ path: '/@/auth/login' })
    }
  }

}
</script>
