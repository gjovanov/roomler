<template>
  <client-only>
    &nbsp;
  </client-only>
</template>

<script>

export default {
  computed: {
    room () {
      return this.$store.state.api.room.room
    },
    user () {
      return this.$store.state.api.auth.user
    }
  },
  async mounted () {
    if (!this.room || !this.room._id) {
      await this.$store.dispatch('api/room/get', this.$route.params.room)
    }
    if (!this.room || !this.room._id) {
      return this.$router.push({ path: '/' })
    }
    const type = ((this.$route.name === 'room-join')
      ? (this.$route.query.moderator !== undefined ? 'moderator' : 'member') : null)
    const join = this.room && this.room._id && type ? `${this.room._id}|${type}` : ''

    if (join) {
      this.$store.commit('api/invite/storePendingJoins', join, {
        root: true
      })
    }
    if (!this.user || !this.user._id) {
      const toast = {
        prop: 'global',
        message: 'Unauthorized: Please login or register before you can join any Room',
        error: true
      }
      this.$store.commit('toast/push', toast, {
        root: true
      })
      return this.$router.push({ path: '/@/auth/login' })
    }
    await this.$store.dispatch('api/invite/acceptPendingJoins', this.user._id)
    await this.$store.dispatch('connectWebSocket')
    if (join) {
      return this.$router.push({ path: `/${this.room.path}/chat` })
    }
  }
}
</script>
