<template>
  <v-container fluid style="height: 100%">
    <no-ssr>
      <v-data-table
        :headers="headers"
        :items="visits"
        item-key="connection._id"
        class="elevation-1"
      />
    </no-ssr>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      selected: [],
      singleSelect: false,
      headers: [
        {
          text: 'Country',
          align: 'start',
          value: 'connection.geoip.country.name'
        },
        { text: 'Browser', value: 'connection.browser.name' },
        { text: 'Os', value: 'connection.os.name' },
        { text: 'User', value: 'connection.user.username' },
        { text: 'Url', value: 'url' },
        { text: 'Referrer', value: 'referrer' },
        { text: 'Created', value: 'createdAt' }
      ]
    }
  },
  computed: {
    visits () {
      return this.$store.state.api.visit.visits
    },
    visitsCount () {
      return this.$store.state.api.visit.visitsCount
    }
  },
  async mounted () {
    await this.$store.dispatch('api/visit/getAll', this.$route.query)
  }
}
</script>
