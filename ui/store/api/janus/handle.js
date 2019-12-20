import { toHandleDTO } from '@/services/handle-mapper'

export const state = () => ({
  handles: []
})

export const mutations = {
  set (state, { handleDTO, handle }) {
    handleDTO.handle = handle
  },
  push (state, { sessionDTO, handleDTO }) {
    const handles = sessionDTO.handleDTOs.filter(h => h.id !== handleDTO.id)
    handles.push(handleDTO)
    sessionDTO.handleDTOs = handles
  },
  pull (state, { sessionDTO, handleDTO }) {
    handleDTO.handle = null
    sessionDTO.handleDTOs = sessionDTO.handleDTOs.filter(h => h.id !== handleDTO.id)
  }
}

export const actions = {
  attach ({
    commit,
    dispatch
  }, { sessionDTO, args }) {
    const self = this
    self.$Janus.debug('Attaching')
    return new Promise((resolve, reject) => {
      const handleDTO = toHandleDTO(sessionDTO, args)
      commit('push', { sessionDTO, handleDTO })
      sessionDTO.session.attach({
        plugin: handleDTO.plugin,
        opaqueId: handleDTO.opaqueId,
        success: (handle) => {
          commit('set', { handleDTO, handle })
          resolve(handleDTO)
        },
        error: (error) => {
          reject(error)
        },
        consentDialog: (on) => {
          commit('api/janus/videoroom/handlers/consentDialog', { handleDTO, on }, { root: true })
        },
        webrtcState: (on, reason) => {
          commit('api/janus/videoroom/handlers/webrtcState', { handleDTO, on, reason }, { root: true })
        },
        iceState: (on) => {
          commit('api/janus/videoroom/handlers/iceState', { handleDTO, on }, { root: true })
        },
        mediaState: (type, on) => {
          commit('api/janus/videoroom/handlers/mediaState', { handleDTO, type, on }, { root: true })
        },
        slowLink: (on) => {
          commit('api/janus/videoroom/handlers/slowLink', { handleDTO, on }, { root: true })
        },
        onlocalstream: (stream) => {
          commit('api/janus/videoroom/handlers/onlocalstream', { handleDTO, stream }, { root: true })
        },
        onremotestream: (stream) => {
          commit('api/janus/videoroom/handlers/onremotestream', { handleDTO, stream }, { root: true })
        },
        ondataopen: () => {
          commit('api/janus/videoroom/handlers/ondataopen', { handleDTO }, { root: true })
        },
        ondata: (data) => {
          dispatch('api/janus/videoroom/handlers/ondata', { handleDTO, data }, { root: true })
        },
        oncleanup: () => {
          commit('api/janus/videoroom/handlers/oncleanup', { handleDTO }, { root: true })
          // commit('api/janus/handle/pull', { sessionDTO, handleDTO }, { root: true })
        },
        ondetached: () => {
          self.$Janus.debug('Detaching.............')
          // commit('api/janus/handle/pull', { sessionDTO, handleDTO }, { root: true })
        },
        onmessage: (msg, jsep) => {
          dispatch('api/janus/videoroom/handlers/onmessage', { handleDTO, msg, jsep }, { root: true })
        }
      })
    })
  },

  async attachPublisher (
    {
      commit,
      dispatch
    }, { sessionDTO, args }) {
    const handleDTO = await dispatch('api/janus/handle/attach', { sessionDTO, args }, { root: true })
    commit('api/janus/videoroom/handlers/setPublisher', { handleDTO, isPublisher: true }, { root: true })
    return handleDTO
  },

  async attachSubscriber (
    {
      commit,
      dispatch
    }, { sessionDTO, args }) {
    const handleDTO = await dispatch('api/janus/handle/attach', { sessionDTO, args }, { root: true })
    commit('api/janus/videoroom/handlers/setPublisher', { handleDTO, isPublisher: false }, { root: true })
    return handleDTO
  },

  attachAttendee ({
    commit,
    dispatch
  }, { sessionDTO, args }) {
    const self = this
    self.$Janus.debug('Attaching:attendee')
    const handleDTO = toHandleDTO(sessionDTO, args)
    commit('push', { sessionDTO, handleDTO })
    return handleDTO
  },

  detach ({
    commit,
    dispatch
  }, { handleDTO }) {
    return new Promise((resolve, reject) => {
      handleDTO.handle.detach({
        success () {
          resolve()
        },
        error (error) {
          reject(error)
        }
      })
    })
  },

  createOffer ({
    commit
  }, { handleDTO }) {
    return new Promise((resolve, reject) => {
      handleDTO.handle.createOffer({
        iceRestart: handleDTO.iceRestart,
        media: {
          audioRecv: false,
          videoRecv: false,
          audioSend: handleDTO.sendAudio,
          videoSend: handleDTO.sendVideo,
          data: handleDTO.data
        },
        simulcast: handleDTO.simulcast,
        trickle: handleDTO.trickle,
        success: (jsep) => {
          resolve(jsep)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  },

  createAnswer ({
    commit
  }, { handleDTO, jsep }) {
    return new Promise((resolve, reject) => {
      handleDTO.handle.createAnswer({
        jsep,
        media: {
          audioSend: false,
          videoSend: false,
          audioRecv: handleDTO.receiveAudio,
          videoRecv: handleDTO.receiveVideo,
          data: handleDTO.receiveData
        },
        success: (jsepObj) => {
          resolve(jsepObj)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }
}
