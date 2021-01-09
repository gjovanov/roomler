<template>
  <div>
    &nbsp;
  </div>
</template>
<script>
export default {
  async mounted () {
    const payload = {
      type: this.$route.params.type,
      code: this.$route.query.code,
      state: this.$route.query.state
    }
    const response = await this.$store.dispatch('api/oauth/getOrCreate', payload)
    if (!response.hasError && response.result) {
      await this.$store.dispatch('api/invite/acceptPendingInvites')
      await this.$store.dispatch('connectWebSocket')
      this.$router.push({ path: this.localePath({ name: '--username', params: { username: `${response.result.user.username}` } }) })
    } else {
      this.$router.push({ path: this.localePath({ name: '--auth-login' }) })
    }
  }

}
</script>
