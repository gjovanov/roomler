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
  async createRoom ({ commit, rootState }, payload) {
    const config = rootState.api.config.config
    const handleArgs = {
      plugin: config.janusSettings.plugins.videoroom
    }
    const session = new Session(this.$Janus, config)
    const handle = await session.init()
      .then(s => s.create())
      .then(s => s.attach(handleArgs))
      .then(h => h.createRoom(payload.media))
    const room = handle.room
    await session.destroy()
    return room
  },

  async destroyRoom ({ commit, rootState }, payload) {
    const config = rootState.api.config.config
    const handleArgs = {
      plugin: config.janusSettings.plugins.videoroom
    }
    const session = new Session(this.$Janus, config)
    await session.init()
      .then(s => s.create())
      .then(s => s.attach(handleArgs))
      .then(h => h.destroyRoom(payload.roomid, payload.secret))
    await session.destroy()
  },

  async listRooms ({ commit, rootState }, payload) {
    const config = rootState.api.config.config
    const handleArgs = {
      plugin: config.janusSettings.plugins.videoroom
    }
    const session = new Session(this.$Janus, config)
    const rooms = await session.init()
      .then(s => s.create())
      .then(s => s.attach(handleArgs))
      .then(h => h.listRooms())
    await session.destroy()
    return rooms
  },

  async joinRoom () {

  }
}
