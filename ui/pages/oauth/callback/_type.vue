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
    const result = await this.$store.dispatch('oauth/_get', payload)
    console.log(result)
    if (result && !result.user && result.oauth) {
      this.$router.push({ path: `/auth/register?email=${result.oauth.email}&username=${result.oauth.name.replace(' ', '_').toLowerCase()}` })
    }
  }

}
</script>
