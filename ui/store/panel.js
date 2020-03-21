
export const state = () => ({
  left: true,
  right: false,
  join: true,
  invite: true,
  chat: true,
  conference: false
})

export const mutations = {
  toggle (state, panel) {
    state[panel] = !state[panel]
  },
  set (state, { panel, value }) {
    state[panel] = value
  }
}
