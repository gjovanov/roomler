<template>
  <v-container fluid style="height: 100%">
    <no-ssr>
      <v-form ref="form">
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filter.from"
                  label="Date"
                  hint="YYYY-MM-DD format"
                  dense
                  persistent-hint
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="filter.from" no-title @input="menu1 = false" />
            </v-menu>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filter.to"
                  label="Date (read only text field)"
                  hint="YYYY-MM-DD format"
                  dense
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="filter.to" no-title @input="menu2 = false" />
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filter.country"
              label="Country code"
              name="Country"
              autocomplete="on"
              dense
              clearable
            />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filter.user"
              label="User"
              name="User"
              autocomplete="on"
              clearable
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filter.os"
              label="OS"
              name="OS"
              autocomplete="on"
              clearable
              dense
            />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filter.browser"
              label="Browser"
              name="Browser"
              autocomplete="on"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filter.url"
              label="URL"
              name="URL"
              autocomplete="on"
              clearable
              dense
            />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filter.referrer"
              label="Referrer"
              name="Referrer"
              autocomplete="on"
              clearable
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-pagination
              v-model="filter.page"
              :length="reportsCount"
              :total-visible="5"
            />
            <v-data-table
              :headers="headers"
              :items="reports"
              :page.sync="filter.page"
              :items-per-page="filter.size"
              :options.sync="options"
              :server-items-length="reportsCount"
              :loading="loading"
              item-key="_id"
              hide-default-footer
              class="elevation-1"
            />
          </v-col>
        </v-row>
      </v-form>
    </no-ssr>
  </v-container>
</template>

<script>
export default {
  watchQuery: ['from', 'to', 'country', 'user', 'os', 'browser', 'url', 'referrer', 'page', 'size', 'sortBy', 'sortDesc', 'interval'],
  async asyncData ({ store, query }) {
    if (!query.from && !query.to) {
      const from = new Date()
      from.setDate(from.getDate() - 30)
      query.from = from.toISOString().substr(0, 10)
      query.to = new Date().toISOString().substr(0, 10)
    }
    if (!query.page) {
      query.page = 1
    }
    if (!query.size) {
      query.size = 10
    }
    const q = Object.assign({}, query)
    q.page--

    await store.dispatch('api/visit/getReports', q)
  },
  data () {
    const from = new Date()
    from.setDate(from.getDate() - 30)
    const filter = {
      from: this.$route.query.from || from.toISOString().substr(0, 10),
      to: this.$route.query.to || new Date().toISOString().substr(0, 10),
      country: this.$route.query.country || undefined,
      user: this.$route.query.user || undefined,
      os: this.$route.query.os || undefined,
      browser: this.$route.query.browser || undefined,
      url: this.$route.query.url || undefined,
      referrer: this.$route.query.referrer || undefined,
      page: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
      size: this.$route.query.size ? parseInt(this.$route.query.size) : 10,

      sortBy: 'createdAt',
      sortDesc: true,

      interval: this.$route.query.interval || undefined

    }
    return {
      menu1: false,
      menu2: false,
      timeout: null,
      timeDuration: 300,
      options: {
        page: filter.page,
        itemsPerPage: filter.size
      },

      filter,

      headers: [
        { text: 'Country', value: 'connection.geoip.country.name' },
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
    loading () {
      return this.$store.state.api.visit.reportsLoading
    },
    reports () {
      return this.$store.state.api.visit.reports
    },
    reportsCount () {
      const count = Math.ceil(parseFloat(this.$store.state.api.visit.reportsCount) / this.filter.size)
      console.log(count)
      return count
    }
  },
  watch: {
    filter: {
      deep: true,
      handler () {
        const self = this
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          self.$router.push({ path: self.$route.path, query: self.filter })
        }, self.timeDuration)
      }
    },
    options: {
      deep: true,
      handler () {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        this.filter.sortBy = sortBy
        this.filter.sortDesc = sortDesc
        this.filter.page = page
        this.filter.size = itemsPerPage
      }
    }
  }
}
</script>
