import qs from 'qs'

import { handleVisitPush } from './visit/handlers/visit-push'
import { handleVisitPull } from './visit/handlers/visit-pull'

export const state = () => ({
  visits: []
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
  setVisits (state, visits) {
    const url = this.state.api.config.config.appSettings.env.URL
    visits.forEach((visit) => {
      simplifyUrl(visit, url)
    })
    state.visits = visits
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
      const query = qs.stringify(params, { encode: false })
      response.result = await this.$axios.$get(`/api/visit/get-all?${query}`)
      const url = rootState.api.config.config.appSettings.env.URL
      if (response.result && response.result.length) {
        response.result.forEach((visit) => {
          if (visit.url) {
            visit.url = visit.url.replace(url, '')
          }
          if (visit.referrer) {
            visit.referrer = visit.referrer.replace(url, '')
          }
        })
      }
      commit('setVisits', response.result ? response.result : [])
    } catch (err) {
      // handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}

export const getters = {

}
