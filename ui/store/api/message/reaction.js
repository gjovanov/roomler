import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const actions = {
  async push ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        this.$wss.send(JSON.stringify(payload))
      } else {
        response.result = await this.$axios.$put(`/api/message/reactions/push/${payload.message}`, payload.data)
        if (response.result.length) {
          commit('api/message/pushAll', { room: response.result[0].room.path, messages: response.result }, {
            root: true
          })
        }
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
