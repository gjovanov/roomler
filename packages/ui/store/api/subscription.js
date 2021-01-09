import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const actions = {
  async create ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/subscription/create', payload)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async delete ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put('/api/subscription/delete', payload)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
