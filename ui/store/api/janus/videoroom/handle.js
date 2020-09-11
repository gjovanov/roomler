import { HandleDto } from '@/services/handle-dto'

export const mutations = {
  set (state, { handleDto, handle }) {
    handleDto.handle = handle
  },
  push (state, { sessionDto, handleDto }) {
    const handles = sessionDto.videoroomHandles.filter(h => h.id !== handleDto.id)
    handles.push(handleDto)
    sessionDto.videoroomHandles = handles
  },
  pull (state, { sessionDto, handleDto }) {
    handleDto.handle = null
    sessionDto.videoroomHandles = sessionDto.videoroomHandles.filter(h => h.id !== handleDto.id)
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
          commit('api/janus/videoroom/updates/consentDialog', { handleDto, on }, { root: true })
        },
        webrtcState: (on, reason) => {
          commit('api/janus/videoroom/updates/webrtcState', { handleDto, on, reason }, { root: true })
        },
        iceState: (on) => {
          commit('api/janus/videoroom/updates/iceState', { handleDto, on }, { root: true })
        },
        mediaState: (type, on) => {
          commit('api/janus/videoroom/updates/mediaState', { handleDto, type, on }, { root: true })
        },
        slowLink: (on) => {
          commit('api/janus/videoroom/updates/slowLink', { handleDto, on }, { root: true })
        },
        onlocalstream: (stream) => {
          commit('api/janus/videoroom/updates/onlocalstream', { handleDto, stream, commit }, { root: true })
        },
        onremotestream: (stream) => {
          commit('api/janus/videoroom/updates/onremotestream', { handleDto, stream, commit }, { root: true })
        },
        ondataopen: () => {
          commit('api/janus/videoroom/updates/ondataopen', { handleDto }, { root: true })
        },
        ondata: (data) => {
          dispatch('api/janus/videoroom/handlers/ondata', { handleDto, data }, { root: true })
        },
        oncleanup: () => {
          commit('api/janus/videoroom/updates/oncleanup', { handleDto }, { root: true })
          // commit('api/janus/videoroom/handle/pull', { sessionDto, handleDto }, { root: true })
        },
        ondetached: () => {
          self.$Janus.debug('Detaching.............')
          // commit('api/janus/videoroom/handle/pull', { sessionDto, handleDto }, { root: true })
        },
        onmessage: (msg, jsep) => {
          dispatch('api/janus/videoroom/handlers/onmessage', { handleDto, msg, jsep }, { root: true })
        }
      })
    })
  },

  async attachPublisher (
    {
      commit,
      dispatch
    }, { sessionDto, args }) {
    const handleDto = await dispatch('api/janus/videoroom/handle/attach', { sessionDto, args }, { root: true })
    commit('api/janus/videoroom/updates/setPublisher', { handleDto, isPublisher: true }, { root: true })
    return handleDto
  },

  async attachSubscriber (
    {
      commit,
      dispatch
    }, { sessionDto, args }) {
    const handleDto = await dispatch('api/janus/videoroom/handle/attach', { sessionDto, args }, { root: true })
    commit('api/janus/videoroom/updates/setPublisher', { handleDto, isPublisher: false }, { root: true })
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
            commit('api/janus/videoroom/handle/set', { handleDto, handle: null }, { root: true })
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
        audio: handleDto.media.audio.enabled && !handleDto.room.media.use_sip_bridge,
        video: handleDto.media.screen.enabled ? 'screen' : (handleDto.media.video.enabled ? handleDto.media.video.resolution : false),
        data: handleDto.data
      }
      if (handleDto.media.audio.enabled === true && handleDto.mediaState.audio === false && !handleDto.room.media.use_sip_bridge) {
        media.addAudio = true
      }
      if (handleDto.media.audio.enabled === false && handleDto.mediaState.audio === true && !handleDto.room.media.use_sip_bridge) {
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
