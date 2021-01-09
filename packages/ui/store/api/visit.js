import qs from 'qs'

import { handleVisitPush } from './visit/handlers/visit-push'
import { handleVisitPull } from './visit/handlers/visit-pull'

export const state = () => ({
  statsLoading: false,
  stats: [],
  statsCount: 0,

  countries: [],
  os: [],
  browsers: [],
  pages: [],
  refs: [],
  users: []
})

const simplifyUrl = (stat, url) => {
  if (stat.url) {
    stat.url = stat.url.replace(url, '')
  }
  if (stat.referrer) {
    stat.referrer = stat.referrer.replace(url, '')
  }
}

export const mutations = {
  setStatsLoading (state, { value }) {
    state.statsLoading = value
  },
  setStats (state, stats) {
    const url = this.state.api.config.config.appSettings.env.URL
    if (stats.data) {
      stats.data.forEach((stat) => {
        simplifyUrl(stat, url)
      })
    }
    state.stats = stats.data || []
    state.statsCount = stats.count || 0

    state.countries = stats.countries || []
    state.os = stats.os || []
    state.browsers = stats.browsers || []
    state.pages = stats.pages || []
    state.refs = stats.refs || []
    state.users = stats.users || []
  },
  push (state, stat) {
    const url = this.state.api.config.config.appSettings.env.URL
    simplifyUrl(stat, url)
    const found = state.stats.find(v => v.connection._id === stat.connection._id)
    if (!found) {
      state.stats = [stat, ...state.stats].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    } else {
      state.stats = state.stats
        .map(v => v.connection._id === stat.connection._id ? stat : v)
    }
  },
  pull (state, stat) {
    state.stats = state.stats
      .filter(v => v.connection._id !== stat.connection._id)
  }
}

export const actions = {
  subscribe ({
    dispatch,
    commit,
    state,
    rootState
  }, { router, localePath }) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      handleVisitPush(dispatch, commit, state, rootState, router, localePath, data)
      handleVisitPull(dispatch, commit, state, rootState, router, localePath, data)
    })
  },

  openVisit ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        const message = {
          op: rootState.api.config.config.wsSettings.opTypes.visitOpen,
          payload
        }
        this.$wss.send(JSON.stringify(message))
      }
    } catch (err) {
      response.hasError = true
    }
    return response
  },

  async getStats ({
    commit,
    state,
    rootState
  }, params) {
    const response = {}
    try {
      const query = qs.stringify(params, { encode: false })
      commit('setStatsLoading', { value: true })
      response.result = await this.$axios.$get(`/api/visit/get-stats?${query}`)
      commit('setStats', response.result ? response.result : [])
      commit('setStatsLoading', { value: false })
    } catch (err) {
      // handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}

export const getters = {

}
