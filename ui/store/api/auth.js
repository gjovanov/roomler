import {
  storage
} from '@/services/storage'

import {
  handleError,
  handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  user: null,
  token: null,
  oauth: null
})

export const mutations = {
  storeUserInfo (state, result) {
    storage.set('token', result.token, true)
    state.user = result.user
    state.token = result.token
    if (result.oauth) {
      state.oauth = result.oauth
    }
  },

  clearUserInfo (state) {
    storage.clear('token')
    state.user = null
    state.token = null
    state.oauth = null
  }
}

export const actions = {
  async register ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/register', payload)
      commit('storeUserInfo', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async activate ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/activate', payload)
      commit('storeUserInfo', response.result)
      handleSuccess('Account was successfully activated', commit)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async reset ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/reset', payload)
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async updateUsername ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put('/api/auth/update/username', payload)
      commit('storeUserInfo', response.result)
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async updatePassword ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put('/api/auth/update/password', payload)
      commit('storeUserInfo', response.result)
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async login ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/login', payload)
      commit('storeUserInfo', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  logout ({
    commit
  }, payload) {
    try {
      commit('api/room/setRooms', [], {
        root: true
      })
      commit('clearUserInfo')
    } catch (err) {
      handleError(err, commit)
    }
  },

  async me ({
    commit
  }) {
    const response = {}
    try {
      const token = storage.get('token')
      if (token) {
        commit('storeUserInfo', {
          token
        })
        response.result = await this.$axios.$get('/api/auth/me')
        commit('storeUserInfo', response.result)
      }
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async get ({
    commit
  }, username) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/auth/get/${username}`)
    } catch (err) {
      handleError(err, commit)
    }
    return response
  }
}

export const getters = {
  isAuthenticated: (state) => {
    return state.token && state.user && state.user.username
  },
  isActivated: (state) => {
    return state.token && state.user && state.user.username && state.user.is_active
  },
  avatarUrl: (state) => {
    return state.oauth ? state.oauth.avatar_url : (state.user ? state.user.avatar_url : null)
  }
}
