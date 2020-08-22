import qs from 'qs'
import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'
import { handleCallPush } from './handlers/call-push'
import { handleCallPull } from './handlers/call-pull'

export const state = () => ({
  calls: [],

  reportsLoading: true,
  reports: [],
  reportsCount: 0,

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
  setLoading (state, { type, value }) {
    state[`${type}Loading`] = value
  },
  setReports (state, reports) {
    state.reports = reports.data
    state.reportsCount = reports.count

    state.rooms = reports.rooms
    state.countries = reports.countries
    state.os = reports.os
    state.browsers = reports.browsers
    state.users = reports.users
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
      handleCallPush(dispatch, commit, state, rootState, router, data)
      handleCallPull(dispatch, commit, state, rootState, router, data)
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

  async getReports ({
    commit,
    state,
    rootState
  }, params) {
    const response = {}
    try {
      if (!params.from && !params.to && !params.status) {
        params.status = 'open'
      }
      commit('setLoading', { type: 'reports', value: true })
      const query = qs.stringify(params, { encode: false })
      response.result = await this.$axios.$get(`/api/room/calls/get-reports?${query}`)
      commit('setReports', response.result ? response.result : [])
      commit('setLoading', { type: 'reports', value: false })
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
