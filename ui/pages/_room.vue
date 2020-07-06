<template>
  <client-only>
    <div>
      <nuxt-child />
    </div>
  </client-only>
</template>

<script>
export default {
  watch: {
    '$route.params.room' (newVal) {
      this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](newVal), { root: true })
    }
  },
  mounted () {
    this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](this.$route.params.room), { root: true })
    // if (!this.room || !this.room._id) {
    //   await this.$store.dispatch('api/room/get', this.$route.params.room)
    // }
    // if (!this.room || !this.room._id) {
    //   return this.$router.push({ path: '/' })
    // }
    // const type = ((this.$route.name === 'room-join')
    //   ? (this.$route.query.moderator !== undefined ? 'moderator' : 'member') : null)
    // const join = this.room && this.room._id && type ? `${this.room._id}|${type}` : ''

    // if (join) {
    //   this.$store.commit('api/invite/storePendingJoins', join, {
    //     root: true
    //   })
    // }
    // if (!this.user || !this.user._id) {
    //   const toast = {
    //     prop: 'global',
    //     message: 'Unauthorized: Please login or register before you can join any Room',
    //     error: true
    //   }
    //   this.$store.commit('toast/push', toast, {
    //     root: true
    //   })
    //   return this.$router.push({ path: '/@/auth/login' })
    // }
    // await this.$store.dispatch('api/invite/acceptPendingJoins', this.user._id)
    // if (join) {
    //   return this.$router.push({ path: `/${this.room.path}/chat` })
    // }
  },
  beforeDestroy () {
    this.$store.commit('api/room/setRoom', this.$store.getters['api/room/selectedRoom'](null), { root: true })
  }
}
</script>
