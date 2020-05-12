import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

import { handleCallPush } from './handlers/call-push'
import { handleCallPull } from './handlers/call-pull'

export const state = () => ({
  calls: []
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

  openCall ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
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
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
