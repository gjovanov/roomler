
export const state = () => ({
  left: true,
  right: true
})

export const mutations = {
  toggle (state, panel) {
    state[panel] = !state[panel]
  },
  set (state, { panel, value }) {
    state[panel] = value
  }
}
