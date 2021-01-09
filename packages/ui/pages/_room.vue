<template>
  <client-only>
    <div>
      <nuxt-child />
    </div>
  </client-only>
</template>

<script>
export default {
  async asyncData ({ store, params, getters }) {
    const room = store.getters['api/room/getRoom'](params.room)
    if (!room) {
      await store.dispatch('api/room/get', params.room)
    } else {
      store.commit('api/room/setRoom', room, { root: true })
    }
  },
  watch: {
    '$route.params.room' (newVal) {
      this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](newVal), { root: true })
    }
  },
  mounted () {
    this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](this.$route.params.room), { root: true })
  },
  beforeDestroy () {
    this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](null), { root: true })
  }
}
</script>
