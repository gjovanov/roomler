import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  invites: []
})

export const mutations = {
  setInvites (state, invites) {
    state.invites = invites
  },
  push (state, invite) {
    state.invites.push(invite)
  },
  pull (state, invite) {
    state.invites = state.invites.filter(r => r._id !== invite._id)
  }
}

export const actions = {
  async create ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/invite/create', payload)
      commit('push', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },
  async              get ({
    commit,
    state
  }, id) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/invite/get?id=${id}`)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async getAll ({
    commit,
    state
  }, roomid) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/invite/get-all?room=${roomid}`)
      commit('setInvites', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
