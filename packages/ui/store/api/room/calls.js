import qs from 'qs'
import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'
import { handleCallPush } from './handlers/call-push'
import { handleCallPull } from './handlers/call-pull'

export const state = () => ({
  calls: [],

  statsLoading: false,
  stats: [],
  statsCount: 0,

  rooms: [],
  countries: [],
  os: [],
  browsers: [],
  users: []
})

export const mutations = {
  setCalls (state, calls) {
    state.calls = calls
  },
  pushCall (state, call) {
    state.calls.push(call)
  },
  pullCall (state, call) {
    state.calls = state.calls.filter(c => c._id !== call._id)
  },
  setStatsLoading (state, { type, value }) {
    state.statsLoading = value
  },
  setStats (state, stats) {
    state.stats = stats.data
    state.statsCount = stats.count

    state.rooms = stats.rooms
    state.countries = stats.countries
    state.os = stats.os
    state.browsers = stats.browsers
    state.users = stats.users
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
      handleCallPush(dispatch, commit, state, rootState, router, localePath, data)
      handleCallPull(dispatch, commit, state, rootState, router, localePath, data)
    })
  },

  async getAll ({
    commit,
    state
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get('/api/room/calls/get-all')
      commit('setCalls', response.result ? response.result : [])
    } catch (err) {
      handleError(err, commit)
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
      if (!params.from && !params.to && !params.status) {
        params.status = 'open'
      }
      commit('setStatsLoading', { value: true })
      const query = qs.stringify(params, { encode: false })
      response.result = await this.$axios.$get(`/api/room/calls/get-stats?${query}`)
      commit('setStats', response.result ? response.result : [])
      commit('setStatsLoading', { value: false })
    } catch (err) {
      // handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  openCall ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        payload.device_id = this.$wss.trackingService.deviceId
        payload.os = {
          name: this.$wss.trackingService.os.name,
          version: this.$wss.trackingService.os.version
        }
        payload.browser = {
          name: this.$wss.trackingService.browser.name,
          version: this.$wss.trackingService.browser.version
        }
        const message = {
          op: rootState.api.config.config.wsSettings.opTypes.roomCallOpen,
          payload
        }
        this.$wss.send(JSON.stringify(message))
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  closeCall ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        const message = {
          op: rootState.api.config.config.wsSettings.opTypes.roomCallClose,
          payload
        }
        this.$wss.send(JSON.stringify(message))
      } else {
        navigator.sendBeacon(`${rootState.api.config.config.appSettings.env.API_URL}/api/room/calls/pull/${payload.id}`)
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}

export const getters = {
  getCall: state => (id) => {
    return state.calls.find(c => c._id === id)
  },
  callsByRoom: (state) => {
    const map = {}
    state.calls.forEach((call) => {
      const key = call.room
      const collection = map[key]
      if (!collection) {
        map[key] = [call]
      } else {
        collection.push(call)
      }
    })
    return map
  },
  isUserInCall: state => (userid) => {
    const calls = state.calls.filter(c => c.user === userid)
    return !!calls.length
  }
}
