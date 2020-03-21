import { toSessionDTO } from '@/services/session-mapper'

export const state = () => ({
  sessionDTOs: [
  ]
})

export const mutations = {
  set (state, { sessionDTO, session }) {
    sessionDTO.session = session
  },
  push (state, sessionDTO) {
    state.sessionDTOs.push(sessionDTO)
  },
  pull (state, sessionDTO) {
    sessionDTO.session = null
    state.sessionDTOs = state.sessionDTOs.filter(s => s.id !== sessionDTO.id)
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

  create ({
    commit,
    rootState
  }) {
    const sessionDTO = toSessionDTO(
      rootState.api.config.config.janusSettings.url,
      rootState.api.config.config.janusSettings.iceServers,
      rootState.api.config.config.janusSettings.plugins
    )
    commit('push', sessionDTO)
    const self = this
    const Janus = self.$Janus
    return new Promise((resolve, reject) => {
      const session = new Janus({
        server: sessionDTO.url,
        iceServers: sessionDTO.iceServers,
        success: () => {
          commit('set', { sessionDTO, session })
          resolve(sessionDTO)
        },
        error: (error) => {
          reject(error)
        },
        destroyed: () => {
          commit('pull', sessionDTO)
        }
      })
    })
  },

  async destroy ({
    commit,
    dispatch,
    state,
    rootState
  }, { sessionDTO }) {
    if (sessionDTO && sessionDTO.session) {
      await Promise.all(sessionDTO.handleDTOs.map(h => dispatch('api/janus/handle/detach', { handleDTO: h }, { root: true })))
      sessionDTO.session.destroy()
      return null
    }
  }
}
