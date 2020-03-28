<template>
  <client-only>
    <div />
  </client-only>
</template>

<script>

export default {
  computed: {
    room () {
      return this.$store.state.api.room.room
    }
  },
  mounted () {
    return this.$router.push({ path: `/${this.room.path}/chat` })
  }
}
</script>
