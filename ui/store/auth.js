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
  peron: null
})

export const mutations = {
  storeUserInfo (state, result) {
    storage.set('token', result.token, true)
    state.user = result.user
    state.token = result.token
    if (result.person) {
      state.person = result.person
    }
    if (result.oauth) {
      state.oauth = result.oauth
    }
  },

  clearUserInfo (state) {
    storage.clear('token')
    state.user = null
    state.token = null
    state.person = null
    state.oauth = null
  }
}

export const actions = {
  async register ({
    commit
  }, payload) {
    const response = {
      hasError: false
    }
    try {
      const result = await this.$axios.$post('/api/auth/register', payload)
      response.result = result
      commit('storeUserInfo', result)
      handleSuccess('Account was successfully created. Check your email on how to activate your account.', commit)
    } catch (err) {
      console.log(err)
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async activate ({
    commit
  }, payload) {
    const response = {
      hasError: false
    }
    try {
      const result = await this.$axios.$post('/api/auth/activate', payload)
      response.result = result
      commit('storeUserInfo', result)
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
    try {
      await this.$axios.$post('/api/auth/reset', payload)
      handleSuccess('Account was reset. Please check your email for further instructions.', commit)
    } catch (err) {
      handleError(err, commit)
    }
  },

  async login ({
    commit
  }, payload) {
    try {
      const result = await this.$axios.$post('/api/auth/login', payload)
      commit('storeUserInfo', result)
    } catch (err) {
      handleError(err, commit)
    }
  },

  logout ({
    commit
  }, payload) {
    try {
      commit('clearUserInfo')
    } catch (err) {
      handleError(err, commit)
    }
  },

  async me ({
    commit
  }) {
    try {
      const token = storage.get('token')
      if (token) {
        commit('storeUserInfo', {
          token
        })
        const result = await this.$axios.$get('/api/auth/me')
        commit('storeUserInfo', result)
      }
    } catch (err) {
      handleError(err, commit)
    }
  }
}

export const getters = {
  isAuthenticated: (state) => {
    return state.token && state.user && state.user.username
  },
  isActivated: (state) => {
    return state.token && state.user && state.user.username && state.user.is_active
  }
}
