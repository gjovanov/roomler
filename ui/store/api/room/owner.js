import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const actions = {
  async transfer ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put(`/api/room/owner/transfer/${payload.room}`, payload)
      if (response.result.room && response.result.users) {
        response.result.users.forEach((user) => {
          commit('api/auth/push', user, {
            root: true
          })
        })
        commit('api/room/push', response.result.room, {
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
