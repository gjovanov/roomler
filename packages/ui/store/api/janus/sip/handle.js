import { HandleDto } from '@/services/handle-dto'

export const mutations = {
  set (state, { handleDto, handle }) {
    handleDto.handle = handle
  },
  push (state, { sessionDto, handleDto }) {
    const handles = sessionDto.sipHandles.filter(h => h.id !== handleDto.id)
    handles.push(handleDto)
    sessionDto.sipHandles = handles
  },
  pull (state, { sessionDto, handleDto }) {
    handleDto.handle = null
    sessionDto.sipHandles = sessionDto.sipHandles.filter(h => h.id !== handleDto.id)
  }
}

export const actions = {
  attach ({
    commit,
    dispatch
  }, { sessionDto, args }) {
    const self = this
    self.$Janus.debug('Attaching')
    args.plugin = 'janus.plugin.sip'
    return new Promise((resolve, reject) => {
      const handleDto = new HandleDto(sessionDto, args)
      commit('push', { sessionDto, handleDto })
      sessionDto.session.attach({
        plugin: handleDto.plugin,
        opaqueId: handleDto.opaqueId,
        success: (handle) => {
          commit('set', { handleDto, handle })
          resolve(handleDto)
        },
        error: (error) => {
          reject(error)
        },
        consentDialog: (on) => {
          commit('api/janus/sip/updates/consentDialog', { handleDto, on }, { root: true })
        },
        webrtcState: (on, reason) => {
          commit('api/janus/sip/updates/webrtcState', { handleDto, on, reason }, { root: true })
        },
        iceState: (on) => {
          commit('api/janus/sip/updates/iceState', { handleDto, on }, { root: true })
        },
        mediaState: (type, on) => {
          commit('api/janus/sip/updates/mediaState', { handleDto, type, on }, { root: true })
        },
        slowLink: (on) => {
          commit('api/janus/sip/updates/slowLink', { handleDto, on }, { root: true })
        },
        onlocalstream: (stream) => {
          commit('api/janus/sip/updates/onlocalstream', { handleDto, stream, commit }, { root: true })
        },
        onremotestream: (stream) => {
          commit('api/janus/sip/updates/onremotestream', { handleDto, stream, commit }, { root: true })
        },
        ondataopen: () => {
          commit('api/janus/sip/updates/ondataopen', { handleDto }, { root: true })
        },
        ondata: (data) => {
          dispatch('api/janus/sip/handlers/ondata', { handleDto, data }, { root: true })
        },
        oncleanup: () => {
          commit('api/janus/sip/updates/oncleanup', { handleDto }, { root: true })
          // commit('api/janus/videoroom/handle/pull', { sessionDto, handleDto }, { root: true })
        },
        ondetached: () => {
          self.$Janus.debug('Detaching.............')
          // commit('api/janus/sip/handle/pull', { sessionDto, handleDto }, { root: true })
        },
        onmessage: (msg, jsep) => {
          dispatch('api/janus/sip/handlers/onmessage', { handleDto, msg, jsep }, { root: true })
        }
      })
    })
  },

  detach ({
    commit,
    dispatch
  }, { handleDto }) {
    return new Promise((resolve, reject) => {
      if (handleDto.handle) {
        handleDto.handle.detach({
          success () {
            commit('api/janus/sip/handle/set', { handleDto, handle: null }, { root: true })
            resolve()
          },
          error (error) {
            reject(error)
          }
        })
      } else {
        resolve()
      }
    })
  },

  createOffer ({
    commit
  }, {
    handleDto
  }) {
    return new Promise((resolve, reject) => {
      const media = {
        audio: true,
        video: false
      }
      handleDto.handle.createOffer({
        media,
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
  }, { handleDto, jsep }) {
    return new Promise((resolve, reject) => {
      const media = {
        audio: true,
        video: false
      }
      handleDto.handle.createAnswer({
        jsep,
        media,
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
