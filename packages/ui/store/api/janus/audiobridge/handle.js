import { HandleDto } from '@/services/handle-dto'

export const mutations = {
  set (state, { handleDto, handle }) {
    handleDto.handle = handle
  },
  push (state, { sessionDto, handleDto }) {
    const handles = sessionDto.audiobridgeHandles.filter(h => h.id !== handleDto.id)
    handles.push(handleDto)
    sessionDto.audiobridgeHandles = handles
  },
  pull (state, { sessionDto, handleDto }) {
    handleDto.handle = null
    sessionDto.audiobridgeHandles = sessionDto.audiobridgeHandles.filter(h => h.id !== handleDto.id)
  }
}

export const actions = {
  attach ({
    commit,
    dispatch
  }, { sessionDto, args }) {
    const self = this
    self.$Janus.debug('Attaching')
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
          commit('api/janus/audiobridge/updates/consentDialog', { handleDto, on }, { root: true })
        },
        webrtcState: (on, reason) => {
          commit('api/janus/audiobridge/updates/webrtcState', { handleDto, on, reason }, { root: true })
        },
        iceState: (on) => {
          commit('api/janus/audiobridge/updates/iceState', { handleDto, on }, { root: true })
        },
        mediaState: (type, on) => {
          commit('api/janus/audiobridge/updates/mediaState', { handleDto, type, on }, { root: true })
        },
        slowLink: (on) => {
          commit('api/janus/audiobridge/updates/slowLink', { handleDto, on }, { root: true })
        },
        onlocalstream: (stream) => {
          commit('api/janus/audiobridge/updates/onlocalstream', { handleDto, stream, commit }, { root: true })
        },
        onremotestream: (stream) => {
          commit('api/janus/audiobridge/updates/onremotestream', { handleDto, stream, commit }, { root: true })
        },
        ondataopen: () => {
          commit('api/janus/audiobridge/updates/ondataopen', { handleDto }, { root: true })
        },
        ondata: (data) => {
          dispatch('api/janus/audiobridge/handlers/ondata', { handleDto, data }, { root: true })
        },
        oncleanup: () => {
          commit('api/janus/audiobridge/updates/oncleanup', { handleDto }, { root: true })
          // commit('api/janus/audiobridge/handle/pull', { sessionDto, handleDto }, { root: true })
        },
        ondetached: () => {
          self.$Janus.debug('Detaching.............')
          // commit('api/janus/audiobridge/handle/pull', { sessionDto, handleDto }, { root: true })
        },
        onmessage: (msg, jsep) => {
          dispatch('api/janus/audiobridge/handlers/onmessage', { handleDto, msg, jsep }, { root: true })
        }
      })
    })
  },

  async attachPublisher (
    {
      commit,
      dispatch
    }, { sessionDto, args }) {
    const handleDto = await dispatch('api/janus/audiobridge/handle/attach', { sessionDto, args }, { root: true })
    commit('api/janus/audiobridge/updates/setPublisher', { handleDto, isPublisher: true }, { root: true })
    return handleDto
  },

  async attachSubscriber (
    {
      commit,
      dispatch
    }, { sessionDto, args }) {
    const handleDto = await dispatch('api/janus/audiobridge/handle/attach', { sessionDto, args }, { root: true })
    commit('api/janus/audiobridge/updates/setPublisher', { handleDto, isPublisher: false }, { root: true })
    return handleDto
  },

  attachAttendee ({
    commit,
    dispatch
  }, { sessionDto, args }) {
    const self = this
    self.$Janus.debug('Attaching:attendee')
    const handleDto = new HandleDto(sessionDto, args)
    commit('push', { sessionDto, handleDto })
    return handleDto
  },

  detach ({
    commit,
    dispatch
  }, { handleDto }) {
    return new Promise((resolve, reject) => {
      if (handleDto.handle) {
        handleDto.handle.detach({
          success () {
            commit('api/janus/audiobridge/handle/set', { handleDto, handle: null }, { root: true })
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
    handleDto, options = {
      iceRestart: undefined
    }
  }) {
    return new Promise((resolve, reject) => {
      const media = {
        audioRecv: false,
        videoRecv: false,
        audio: handleDto.media.audio.enabled,
        video: handleDto.media.screen.enabled ? 'screen' : (handleDto.media.video.enabled ? handleDto.media.video.resolution : false),
        data: handleDto.data
      }
      if (handleDto.media.audio.enabled === true && handleDto.mediaState.audio === false) {
        media.addAudio = true
      }
      if (handleDto.media.audio.enabled === false && handleDto.mediaState.audio === true) {
        media.removeAudio = true
      }
      if ((handleDto.media.video.enabled === true || handleDto.media.screen.enabled === true) && handleDto.mediaState.video === false) {
        media.addVideo = true
      }
      if ((handleDto.media.video.enabled === false && handleDto.media.screen.enabled === false) && handleDto.mediaState.video === true) {
        media.removeVideo = true
      }
      if ((handleDto.media.video.enabled === true || handleDto.media.screen.enabled === true) && handleDto.mediaState.video === true) {
        media.replaceVideo = true
      }
      if ((handleDto.media.video.enabled === true) && handleDto.mediaState.resolution !== handleDto.media.video.resolution) {
        media.replaceVideo = true
      }
      handleDto.handle.createOffer({
        media,
        simulcast: handleDto.simulcast,
        trickle: handleDto.trickle,
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
        audioSend: false,
        videoSend: false,
        audioRecv: true,
        videoRecv: true,
        data: handleDto.media.data.enabled
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
