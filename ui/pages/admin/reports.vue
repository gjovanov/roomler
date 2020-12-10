<template>
  <v-container fluid style="height: 100%" class="pa-0">
    <client-only>
      <v-expansion-panels
        v-model="filter.panel"
        accordion
        style="height: 100%"
      >
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <v-icon>
                fa-search
              </v-icon> &nbsp;
              <span style="font-weight: 500">Filters</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form ref="form">
              <v-row>
                <v-col cols="12" sm="12" md="6" lg="3">
                  <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template #activator="{ on, attrs }">
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
                <v-col cols="12" sm="12" md="6" lg="3">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template #activator="{ on, attrs }">
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
                <v-col cols="12" sm="12" md="6" lg="3">
                  <v-select
                    v-model="filter.status"
                    label="Status"
                    name="Status"
                    :items="['open', 'closed']"
                    autocomplete="on"
                    dense
                    clearable
                  />
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="3">
                  <v-text-field
                    v-model="filter.room"
                    label="Room"
                    name="Room"
                    autocomplete="on"
                    clearable
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="3">
                  <v-text-field
                    v-model="filter.country"
                    label="Country code"
                    name="Country"
                    autocomplete="on"
                    dense
                    clearable
                  />
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="3">
                  <v-text-field
                    v-model="filter.user"
                    label="User"
                    name="User"
                    autocomplete="on"
                    clearable
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="3">
                  <v-text-field
                    v-model="filter.os"
                    label="OS"
                    name="OS"
                    autocomplete="on"
                    clearable
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="3">
                  <v-text-field
                    v-model="filter.browser"
                    label="Browser"
                    name="Browser"
                    autocomplete="on"
                    dense
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
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <v-icon>
                fa-sign-in-alt
              </v-icon> &nbsp;
              <span style="font-weight: 500">Data - visits</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12">
                <v-pagination
                  v-model="filter.pageVisits"
                  :length="visitReportsCount"
                  :total-visible="5"
                />
                <v-data-table
                  :headers="headers.visits"
                  :items="visitReports"
                  :page.sync="filter.pageVisits"
                  :items-per-page="filter.size"
                  :options.sync="options.visits"
                  :server-items-length="visitReportsCount"
                  :loading="visitReportsLoading"
                  item-key="_id"
                  hide-default-footer
                  class="elevation-1"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <v-icon>
                fa-sign-in-alt
              </v-icon> &nbsp;
              <span style="font-weight: 500">Data - calls</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12">
                <v-pagination
                  v-model="filter.pageCalls"
                  :length="callReportsCount"
                  :total-visible="5"
                />
                <v-data-table
                  :headers="headers.calls"
                  :items="callReports"
                  :page.sync="filter.pageCalls"
                  :items-per-page="filter.size"
                  :options.sync="options.calls"
                  :server-items-length="callReportsCount"
                  :loading="callReportsLoading"
                  item-key="_id"
                  hide-default-footer
                  class="elevation-1"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <v-icon>
                fa-chart-line
              </v-icon> &nbsp;
              <span style="font-weight: 500">Charts - visits</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <country-chart :from="filter.from" :to="filter.to" :items="$store.state.api.visit.countries" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <os-chart :from="filter.from" :to="filter.to" :items="$store.state.api.visit.os" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <browser-chart :from="filter.from" :to="filter.to" :items="$store.state.api.visit.browsers" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <user-chart :from="filter.from" :to="filter.to" :items="$store.state.api.visit.users" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <ref-chart :from="filter.from" :to="filter.to" :items="$store.state.api.visit.refs" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 600px;">
                <page-chart :from="filter.from" :to="filter.to" :items="$store.state.api.visit.pages" />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <v-icon>
                fa-chart-line
              </v-icon> &nbsp;
              <span style="font-weight: 500">Charts - calls</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <room-chart :from="filter.from" :to="filter.to" :items="$store.state.api.room.calls.rooms" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <country-chart :from="filter.from" :to="filter.to" :items="$store.state.api.room.calls.countries" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <os-chart :from="filter.from" :to="filter.to" :items="$store.state.api.room.calls.os" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <browser-chart :from="filter.from" :to="filter.to" :items="$store.state.api.room.calls.browsers" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="height: 400px;">
                <user-chart :from="filter.from" :to="filter.to" :items="$store.state.api.room.calls.users" />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </client-only>
  </v-container>
</template>

<script>
import CountryChart from '@/components/chart/country-chart'
import OsChart from '@/components/chart/os-chart'
import BrowserChart from '@/components/chart/browser-chart'
import RoomChart from '@/components/chart/room-chart'
import UserChart from '@/components/chart/user-chart'
import RefChart from '@/components/chart/ref-chart'
import PageChart from '@/components/chart/page-chart'

export default {
  components: {
    CountryChart,
    OsChart,
    BrowserChart,
    RoomChart,
    UserChart,
    RefChart,
    PageChart
  },
  async asyncData ({ store, query }) {
    if (!query.from && !query.to) {
      const from = new Date()
      from.setDate(from.getDate() - 30)
      query.from = from.toISOString().substr(0, 10)
      query.to = new Date().toISOString().substr(0, 10)
    }
    if (!query.pageVisits) {
      query.pageVisits = 1
    }
    if (!query.pageCalls) {
      query.pageCalls = 1
    }
    if (!query.size) {
      query.size = 10
    }
    const q1 = Object.assign({}, query)
    q1.page = q1.pageVisits
    delete q1.pageVisits
    q1.page--
    const q2 = Object.assign({}, query)
    q2.page = q2.pageCalls
    delete q2.pageCalls
    q2.page--

    await Promise.all([store.dispatch('api/visit/getReports', q1), store.dispatch('api/room/calls/getReports', q2)])
  },
  data () {
    const from = new Date()
    from.setDate(from.getDate() - 30)
    const filter = {
      from: this.$route.query.from || from.toISOString().substr(0, 10),
      to: this.$route.query.to || new Date().toISOString().substr(0, 10),
      status: this.$route.query.status || undefined,
      room: this.$route.query.room || undefined,
      country: this.$route.query.country || undefined,
      user: this.$route.query.user || undefined,
      os: this.$route.query.os || undefined,
      browser: this.$route.query.browser || undefined,
      url: this.$route.query.url || undefined,
      referrer: this.$route.query.referrer || undefined,
      pageVisits: this.$route.query.pageVisits ? parseInt(this.$route.query.pageVisits) : 1,
      pageCalls: this.$route.query.pageCalls ? parseInt(this.$route.query.pageCalls) : 1,
      size: this.$route.query.size ? parseInt(this.$route.query.size) : 10,
      panel: this.$route.query.panel !== undefined ? (this.$route.query.panel !== null
        ? parseInt(this.$route.query.panel) : 0) : null,

      sortBy: this.$route.query.sortBy || [],
      sortDesc: this.$route.query.sortDesc || [],

      interval: this.$route.query.interval || undefined

    }
    return {
      panels: 0,
      menu1: false,
      menu2: false,
      timeout: null,
      timeout2: null,
      timeDuration: 300,
      options: {
        visits: {
          page: filter.pageVisits,
          itemsPerPage: filter.size
        },
        calls: {
          page: filter.pageCalls,
          itemsPerPage: filter.size
        }
      },

      filter,

      headers: {
        visits: [
          { text: 'Country', value: 'connection.geoip.country.name' },
          { text: 'Browser', value: 'connection.browser.name' },
          { text: 'Os', value: 'connection.os.name' },
          { text: 'User', value: 'connection.user.username' },
          { text: 'Url', value: 'page' },
          { text: 'Referrer', value: 'ref' },
          { text: 'Created', value: 'createdAt' },
          { text: 'Duration (min)', value: 'duration' }
        ],
        calls: [
          { text: 'Country', value: 'geoip.country.name' },
          { text: 'Browser', value: 'browser.name' },
          { text: 'Os', value: 'os.name' },
          { text: 'User', value: 'user.username' },
          { text: 'Created', value: 'createdAt' },
          { text: 'Duration (min)', value: 'duration' }
        ]
      }
    }
  },
  computed: {
    needsPageReset () {
      return `${this.filter.from}${this.filter.to}${this.filter.status}${this.filter.room}${this.filter.country}${this.filter.user}${this.filter.os}${this.filter.browser}${this.filter.url}${this.filter.referrer}${this.filter.size}${this.filter.sortBy}${this.filter.sortDesc}`
    },
    visitReportsLoading () {
      return this.$store.state.api.visit.reportsLoading
    },
    visitReports () {
      return this.$store.state.api.visit.reports
    },
    visitReportsCount () {
      const count = Math.ceil(parseFloat(this.$store.state.api.visit.reportsCount) / this.filter.size)
      return count
    },
    callReportsLoading () {
      return this.$store.state.api.room.calls.reportsLoading
    },
    callReports () {
      return this.$store.state.api.room.calls.reports
    },
    callReportsCount () {
      const count = Math.ceil(parseFloat(this.$store.state.api.room.calls.reportsCount) / this.filter.size)
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

    'options.visits': {
      deep: true,
      handler () {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options.visits
        this.filter.sortBy = sortBy
        this.filter.sortDesc = sortDesc
        this.filter.pageVisits = page
        this.filter.size = itemsPerPage
      }
    },
    'options.calls': {
      deep: true,
      handler () {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options.calls
        this.filter.sortBy = sortBy
        this.filter.sortDesc = sortDesc
        this.filter.pageCalls = page
        this.filter.size = itemsPerPage
      }
    }
  },
  watchQuery: ['from', 'to', 'status', 'room', 'country', 'user', 'os', 'browser', 'url', 'referrer', 'pageVisits', 'pageCalls', 'size', 'sortBy', 'sortDesc', 'interval']
}
</script>

<style scoped>
* >>> .echarts {
  width: 100%;
  height: 100%;
}
</style>
