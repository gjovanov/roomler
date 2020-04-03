<template>
  <client-only>
    &nbsp;
  </client-only>
</template>

<script>

export default {
  middleware: 'authenticated',
  mounted () {
    this.$store.commit('api/conference/setPosition', 'center', { root: true })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('api/conference/setPosition', 'left', { root: true })
    next(true)
  }
}
</script>
