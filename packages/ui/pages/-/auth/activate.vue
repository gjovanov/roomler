<template>
  <v-layout>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card class="elevation-12">
          <v-card-text>
            &nbsp;
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  async beforeMount () {
    const self = this
    const response = await this.$store.dispatch('api/auth/activate', {
      payload: {
        username: this.$route.query.user,
        token: this.$route.query.token
      }
    })
    if (!response.hasError) {
      await this.$store.dispatch('api/invite/acceptPendingInvites')
      await this.$store.dispatch('connectWebSocket')
      self.$router.push({ path: self.localePath({ name: 'index' }) })
    }
  }
}
</script>
