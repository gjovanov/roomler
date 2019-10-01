import Session from '@/services/janus/session'

export const state = () => ({
  session: null
})

export const mutations = {
  set (state, session) {
    state.session = session
  }
}

export const actions = {
  async createRoom (commit, payload) {
    const handleArgs = {
      plugin: payload.plugin
    }
    const session = new Session(this.$Janus)
    const handle = await session.init()
      .then(s => s.create())
      .then(s => s.attach(handleArgs))
      .then(h => h.createRoom(payload.media))
    const room = handle.room
    await session.destroy()
    return room
  },

  async joinRoom () {

  }
}
