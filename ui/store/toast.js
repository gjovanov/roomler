import { v4 as uuid } from 'uuid'
const timeout = 3000
export const state = () => ({
  toasts: []
})

export const mutations = {
  push (state, message) {
    const self = this
    message.id = uuid()
    message.snackbar = true
    state.toasts.push(message)
    const index = state.toasts.length - 1
    setTimeout(() => {
      self.commit('toast/pull', index, {
        root: true
      })
    }, timeout)
  },
  pull (state, index) {
    state.toasts.splice(index, 1)
  }
}
