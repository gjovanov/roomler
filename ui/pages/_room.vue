<template>
  <client-only>
    <v-card
      lg="12"
      md="12"
      class="pa-0 ma-0"
    >
      <nuxt-child />
    </v-card>
  </client-only>
</template>

<script>

export default {
  middleware: 'authenticated',
  mounted () {
    this.$store.commit('panel/set', { panel: 'chat', value: true }, { root: true })
  },
  beforeRouteLeave (to, from, next) {
    const session = this.$store.state.api.conference.session
    if (session) {
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
