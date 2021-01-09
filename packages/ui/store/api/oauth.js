import {
  handleError
} from '@/services/ajax-handlers'

export const actions = {
  async getOrCreate ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/oauth/get-or-create?type=${payload.type}&code=${payload.code}&state=${payload.state}`)
      commit('api/auth/storeUserInfo', response.result, {
        root: true
      })
      commit('api/auth/push', response.result.user, {
        root: true
      })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
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

  oauth: (state) => {
    return state.oauth
  }
}
