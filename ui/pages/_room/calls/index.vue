<template>
  <client-only>
    &nbsp;
  </client-only>
</template>

<script>

export default {
  beforeRouteLeave (to, from, next) {
    this.$store.commit('api/conference/setPosition', 'left', { root: true })
    next(true)
  },
  middleware: 'authenticated',
  mounted () {
    this.$store.commit('api/conference/setPosition', 'center', { root: true })
  }
}
</script>
