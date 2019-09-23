<template>
  <div>
    hey
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
    const response = await this.$store.dispatch('oauth/getOrCreate', payload)
    if (!response.hasError && response.result) {
      if (!response.result.user) {
        this.$router.push({ path: `/auth/register?email=${response.result.oauth.email}&username=${response.result.oauth.name.replace(' ', '_').toLowerCase()}&oauth=${response.result.oauth._id}` })
      } else {
        this.$router.push({ path: '/' })
      }
    } else {
      this.$router.push({ path: '/auth/login' })
    }
  }

}
</script>
