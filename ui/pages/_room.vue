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
    console.log('room')
    this.$store.commit('panel/set', { panel: 'chat', value: true }, { root: true })
  }
}
</script>
