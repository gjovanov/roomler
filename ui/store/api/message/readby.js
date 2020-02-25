import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const actions = {
  async pushAll ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put('/api/message/readby/pushAll', payload)
      if (response.result.length) {
        commit('api/message/pushAll', { roomid: response.result[0].room._id, messages: response.result }, {
          root: true
        })
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
