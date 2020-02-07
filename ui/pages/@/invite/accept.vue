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
    } else {
      this.$router.push({ path: '/@/auth/login' })
    }
  }

}
</script>
