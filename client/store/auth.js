import {
  storage
} from '@/services/storage'

const handleError = (err, commit) => {
  if (Array.isArray(err.errors)) {
    err.errors.forEach((e) => {
      e.error = true
      commit('toast/push', e, {
        root: true
      })
    })
  } else {
    commit('toast/push', {
      prop: err.name,
      message: err.message,
      error: true
    }, {
      root: true
    })
  }
}
const handleSuccess = (message, commit) => {
  const toast = {
    prop: 'global',
    message,
    error: false
  }
  commit('toast/push', toast, {
    root: true
  })
}

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
  },

  clearUserInfo (state) {
    storage.clear('token')
    state.user = null
    state.token = null
    state.person = null
  }
}

export const actions = {
  async register ({
    commit
  }, payload) {
    try {
      const result = await this.$axios.$post('/api/v1/auth/register', payload)
      commit('storeUserInfo', result)
      handleSuccess('Account was successfully created. Check your email on how to activate your account.', commit)
    } catch (err) {
      handleError(err, commit)
    }
  },

  async activate ({
    commit
  }, payload) {
    try {
      const result = await this.$axios.$post('/api/v1/auth/activate', payload)
      commit('storeUserInfo', result)
      handleSuccess('Account was successfully activated', commit)
    } catch (err) {
      handleError(err, commit)
    }
  },

  async reset ({
    commit
  }, payload) {
    try {
      await this.$axios.$post('/api/v1/auth/reset', payload)
      handleSuccess('Account was reset. Please check your email for further instructions.', commit)
    } catch (err) {
      handleError(err, commit)
    }
  },

  async login ({
    commit
  }, payload) {
    try {
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      }
      const result = await this.$axios.$post('/api/v1/auth/login', payload, axiosConfig)
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
        const result = await this.$axios.$get('/api/v1/auth/me')
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
    return state.token && state.user && state.user.username && state.user.isactive
  }
}
