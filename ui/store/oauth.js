import {
  handleError
} from '@/services/ajax-handlers'

export const actions = {
  async _get ({
    commit
  }, payload) {
    try {
      const result = await this.$axios.$get(`/api/oauth/get?type=${payload.type}&code=${payload.code}&state=${payload.state}`)
      commit('auth/storeUserInfo', result, {
        root: true
      })
      return result
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
  },

  oauth: (state) => {
    return state.oauth
  }
}
