import qs from 'qs'

import { handleVisitPush } from './visit/handlers/visit-push'
import { handleVisitPull } from './visit/handlers/visit-pull'

export const state = () => ({
  visitsLoading: true,
  visits: [],
  visitsCount: 0,

  reportsLoading: true,
  reports: [],
  reportsCount: 0
})

const simplifyUrl = (visit, url) => {
  if (visit.url) {
    visit.url = visit.url.replace(url, '')
  }
  if (visit.referrer) {
    visit.referrer = visit.referrer.replace(url, '')
  }
}

export const mutations = {
  setLoading (state, { type, value }) {
    state[`${type}Loading`] = value
  },
  setVisits (state, visits) {
    const url = this.state.api.config.config.appSettings.env.URL
    visits.data.forEach((visit) => {
      simplifyUrl(visit, url)
    })
    state.visits = visits.data
    state.visitsCount = visits.count
  },
  setReports (state, reports) {
    const url = this.state.api.config.config.appSettings.env.URL
    reports.data.forEach((report) => {
      simplifyUrl(report, url)
    })
    state.reports = reports.data
    state.reportsCount = reports.count
  },
  push (state, visit) {
    const url = this.state.api.config.config.appSettings.env.URL
    simplifyUrl(visit, url)
    const found = state.visits.find(v => v.connection._id === visit.connection._id)
    if (!found) {
      state.visits = [visit, ...state.visits].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    } else {
      state.visits = state.visits
        .map(v => v.connection._id === visit.connection._id ? visit : v)
    }
  },
  pull (state, visit) {
    state.visits = state.visits
      .filter(v => v.connection._id !== visit.connection._id)
  }
}

export const actions = {
  subscribe ({
    dispatch,
    commit,
    state,
    rootState
  }, router) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      handleVisitPush(dispatch, commit, state, rootState, router, data)
      handleVisitPull(dispatch, commit, state, rootState, router, data)
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

  async getAll ({
    commit,
    state,
    rootState
  }, params) {
    const response = {}
    try {
      if (!params.from && !params.to && !params.status) {
        params.status = 'open'
      }
      commit('setLoading', { type: 'visits', value: true })
      const query = qs.stringify(params, { encode: false })
      response.result = await this.$axios.$get(`/api/visit/get-all?${query}`)
      commit('setVisits', response.result ? response.result : [])
      commit('setLoading', { type: 'visits', value: false })
    } catch (err) {
      // handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async getReports ({
    commit,
    state,
    rootState
  }, params) {
    const response = {}
    try {
      const query = qs.stringify(params, { encode: false })
      commit('setLoading', { type: 'reports', value: true })
      response.result = await this.$axios.$get(`/api/visit/get-all?${query}`)
      commit('setReports', response.result ? response.result : [])
      commit('setLoading', { type: 'reports', value: false })
    } catch (err) {
      // handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}

export const getters = {

}
