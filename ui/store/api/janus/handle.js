import { HandleDto } from '@/services/handle-dto'

export const mutations = {
  set (state, { handleDto, handle }) {
    handleDto.handle = handle
  },
  push (state, { sessionDto, handleDto }) {
    const handles = sessionDto.handleDtos.filter(h => h.id !== handleDto.id)
    handles.push(handleDto)
    sessionDto.handleDtos = handles
  },
  pull (state, { sessionDto, handleDto }) {
    handleDto.handle = null
    sessionDto.handleDtos = sessionDto.handleDtos.filter(h => h.id !== handleDto.id)
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
          // commit('api/janus/handle/pull', { sessionDto, handleDto }, { root: true })
        },
        ondetached: () => {
          self.$Janus.debug('Detaching.............')
          // commit('api/janus/handle/pull', { sessionDto, handleDto }, { root: true })
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
    const handleDto = await dispatch('api/janus/handle/attach', { sessionDto, args }, { root: true })
    commit('api/janus/videoroom/updates/setPublisher', { handleDto, isPublisher: true }, { root: true })
    return handleDto
  },

  async attachSubscriber (
    {
      commit,
      dispatch
    }, { sessionDto, args }) {
    const handleDto = await dispatch('api/janus/handle/attach', { sessionDto, args }, { root: true })
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
            commit('api/janus/handle/set', { handleDto, handle: null }, { root: true })
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
  }, { handleDto, iceRestart = undefined }) {
    return new Promise((resolve, reject) => {
      const media = {
        audioRecv: false,
        videoRecv: false,
        audio: handleDto.audio,
        video: handleDto.screen ? 'screen' : (handleDto.video && handleDto.video.enabled ? handleDto.video.resolution : false),
        data: handleDto.data
      }
      let restart = false
      if (handleDto.audio === true && handleDto.mediaState.audio === false) {
        media.addAudio = true
        restart = true
      }
      if (handleDto.audio === false && handleDto.mediaState.audio === true) {
        media.removeAudio = true
        restart = true
      }
      if ((handleDto.video === true || handleDto.screen === true) && handleDto.mediaState.video === false) {
        media.addVideo = true
        restart = true
      }
      if ((handleDto.video === false && handleDto.screen === false) && handleDto.mediaState.video === true) {
        media.removeVideo = true
        restart = true
      }
      if ((handleDto.video === true || handleDto.screen === true) && handleDto.mediaState.video === true) {
        media.replaceVideo = true
        restart = true
      }
      handleDto.handle.createOffer({
        iceRestart: iceRestart !== undefined || restart !== undefined ? iceRestart : restart,
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
        data: handleDto.data.enabled
      }
      console.log(media)
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
