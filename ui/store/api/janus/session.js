import { SessionDto } from '@/services/session-dto'

export const state = () => ({
  sessionDtos: [],
  audioInputDevices: [],
  videoInputDevices: []
})

export const mutations = {
  set (state, { sessionDto, session }) {
    sessionDto.session = session
  },
  setDevices (state, devices) {
    state.audioInputDevices = devices.filter(d => d.kind === 'audioinput')
    state.videoInputDevices = devices.filter(d => d.kind === 'videoinput')
  },
  push (state, sessionDto) {
    state.sessionDtos.push(sessionDto)
  },
  pull (state, sessionDto) {
    sessionDto.session = null
    state.sessionDtos = state.sessionDtos.filter(s => s.id !== sessionDto.id)
  }
}

export const actions = {
  init ({ commit }, debug = true) {
    const self = this
    const Janus = self.$Janus
    return new Promise((resolve) => {
      Janus.init({
        debug,
        callback: () => {
          resolve()
        }
      })
    })
  },

  listDevices ({
    commit
  }) {
    return new Promise((resolve) => {
      this.$Janus.listDevices((devices) => {
        commit('setDevices', devices)
        resolve(devices)
      })
    })
  },

  create ({
    commit,
    rootState
  }, room) {
    const sessionDto = new SessionDto(
      rootState.api.config.config.janusSettings.url,
      rootState.api.config.config.janusSettings.iceServers,
      rootState.api.config.config.janusSettings.plugins,
      rootState.api.config.config.asteriskSettings.url,
      rootState.api.auth.user,
      room
    )
    commit('push', sessionDto)
    const self = this
    const Janus = self.$Janus
    return new Promise((resolve, reject) => {
      const session = new Janus({
        server: sessionDto.url,
        iceServers: sessionDto.iceServers,
        success: () => {
          commit('set', { sessionDto, session })
          resolve(sessionDto)
        },
        error: (error) => {
          reject(error)
        },
        destroyed: () => {
          commit('pull', sessionDto)
        }
      })
    })
  },

  async destroy ({
    commit,
    dispatch,
    state,
    rootState
  }, { sessionDto }) {
    if (sessionDto && sessionDto.session) {
      await Promise.all(
        [...sessionDto.videoroomHandles, ...sessionDto.sipHandles, ...sessionDto.audiobridgeHandles].map(h => dispatch('api/janus/handle-factory/detach', { handleDto: h }, { root: true })))
      sessionDto.session.destroy()

      return null
    }
  }
}
