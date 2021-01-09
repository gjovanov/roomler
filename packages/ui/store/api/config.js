import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  config: null
})

export const mutations = {
  setConfig (state, config) {
    state.config = config
  }
}

export const actions = {
  async get ({
    commit,
    state
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get('/api/config/get')
      commit('setConfig', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
