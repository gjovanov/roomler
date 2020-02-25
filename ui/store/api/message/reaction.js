import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const actions = {
  async push ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        const message = {
          op: rootState.api.config.config.wsSettings.opTypes.messageReactionPush,
          payload
        }
        this.$wss.send(JSON.stringify(message))
      } else {
        response.result = await this.$axios.$put(`/api/message/reactions/push/${payload.message}`, payload.data)
        if (response.result.length) {
          commit('api/message/pushAll', { roomid: response.result[0].room._id, messages: response.result }, {
            root: true
          })
        }
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async pull ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        const message = {
          op: rootState.api.config.config.wsSettings.opTypes.messageReactionPull,
          payload
        }
        this.$wss.send(JSON.stringify(message))
      } else {
        response.result = await this.$axios.$put(`/api/message/reactions/pull/${payload.message}`, payload.data)
        if (response.result.length) {
          commit('api/message/pushAll', { roomid: response.result[0].room._id, messages: response.result }, {
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
