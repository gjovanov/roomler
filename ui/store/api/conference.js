import { modelToQuery } from '@/services/handle-dto'
import { resolutions } from '@/utils/resolutions'
import { v4 as uuid } from 'uuid'

export const state = () => ({
  session: null,
  room: null,
  audioDevices: [],
  speakers: [],
  videoDevices: [],
  resolutions
})

export const mutations = {
  set (state, { session, room }) {
    state.session = session
    state.room = room
  },
  setPosition (state, position) {
    state.position = position
  },
  setDevices (state, devices) {
    state.audioDevices = devices.filter(d => d.kind === 'audioinput')
    state.speakers = devices.filter(d => d.kind === 'audiooutput')
    state.videoDevices = devices.filter(d => d.kind === 'videoinput')
  },
  pushDeviceResolution (state, { resolution, deviceId }) {
    resolution.devices.push(deviceId)
  }
}

export const actions = {
  listDevices ({
    commit
  }) {
    const self = this
    return new Promise((resolve) => {
      self.$Janus.listDevices((devices) => {
        commit('setDevices', devices)
        resolve(devices)
      })
    })
  },

  getResolutionsPerDevice ({
    commit,
    state
  }) {
    const self = this
    state.resolutions.forEach((resolution) => {
      state.videoDevices.forEach(async (device) => {
        const constraints = {
          video: {
            deviceId: device.deviceId,
            width: { exact: resolution.width },
            height: { exact: resolution.height }
          }
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints)
          commit('pushDeviceResolution', { resolution, deviceId: device.deviceId })
          self.$Janus.stopAllTracks(stream)
        } catch (err) {
          if (resolution.label === 'HD - 1280x720') {
            console.log(err)
            console.log(resolution)
            console.log(constraints)
          }
        }
      })
    })
  },

  async join ({
    commit,
    dispatch,
    rootState
  }, { user, room, media }) {
    const config = rootState.api.config.config
    const mediaPart = modelToQuery(media)
    const displayPart = user && user.username ? user.username : 'Anonymous'
    const display = `${displayPart}?${mediaPart}`
    const janusPayload = {
      janus: {
        roomid: room.media.roomid,
        room,
        call_id: uuid(),
        isLocal: true,
        plugin: config.janusSettings.plugins.videoroom,
        display,
        bitrateLimit: room.media.bitrate
      },
      media: room.media
    }
    janusPayload.media.room = janusPayload.media.roomid
    janusPayload.media.request = 'create'

    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDto = await dispatch('api/janus/session/create', room, { root: true })
    await dispatch('api/janus/videoroom/join', { sessionDto, janusPayload, room }, { root: true })
    if (room.media.use_sip_bridge) {
      await dispatch('api/janus/sip/join', { sessionDto, janusPayload, room }, { root: true })
    }
    commit('set', { session: sessionDto, room })
  },
  leave ({
    commit,
    dispatch,
    getters,
    state
  }) {
    const localHandle = getters.localHandle
    if (localHandle) {
      dispatch('api/room/calls/closeCall', {
        id: localHandle.call_id
      }, {
        root: true
      })
    }
    dispatch('api/janus/session/destroy', { sessionDto: state.session }, { root: true })
    commit('set', { session: null, room: null })
  },

  async toggleScreen ({
    commit,
    dispatch,
    getters,
    state
  }) {
    const handleDto = getters.localHandle
    const hasVideo = handleDto.media.video.enabled
    const hasAudio = handleDto.media.audio.enabled
    const media = {
      video: {
        enabled: false
      },
      screen: {
        enabled: !handleDto.media.screen.enabled
      }
    }
    try {
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
    } catch (err) {
      if (err.name && err.name.includes('NotAllowedError')) {
        alert(this.app.i18n.t('comps.conference.screenNotAllowedError'))
        let jsep
        media.screen.enabled = false
        media.video.enabled = hasVideo
        commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
        if (hasAudio) {
          jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
        }
        await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
      }
      this.$consola.error(err)
    }
  },
  async toggleScreenMuted ({
    commit,
    dispatch,
    getters,
    state
  }) {
    const handleDto = getters.localHandle
    try {
      const media = {
        screen: {
          muted: !handleDto.media.screen.muted
        }
      }
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto }, { root: true })
      if (handleDto && handleDto.handle && !handleDto.media.screen.muted) {
        handleDto.handle.unmuteVideo()
      } else {
        handleDto.handle.muteVideo()
      }
    } catch (e) {
      this.$consola.error(e)
    }
  },

  async setVideo ({
    commit,
    dispatch,
    getters,
    state
  }, device) {
    const handleDto = getters.localHandle
    const media = {
      video: {
        device
      },
      screen: {
        enabled: false
      }
    }
    try {
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
    } catch (err) {
      if (err.name && err.name.includes('OverconstrainedError')) {
        alert(this.app.i18n.t('comps.conference.overconstrainedError'))
        const defaultResolution = state.resolutions.find(r => r.is_default)
        media.video.resolution = defaultResolution.label
        media.video.width = defaultResolution.width
        media.video.height = defaultResolution.height
        commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
        const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
        await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
      }
      this.$consola.error(err)
    }
  },

  async toggleVideo ({
    commit,
    dispatch,
    getters,
    state
  }) {
    const handleDto = getters.localHandle
    const media = {
      video: {
        enabled: !handleDto.media.video.enabled
      },
      screen: {
        enabled: false
      }
    }
    try {
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
    } catch (err) {
      if (err.name && err.name.includes('OverconstrainedError')) {
        alert(this.app.i18n.t('comps.conference.overconstrainedError'))
        const defaultResolution = state.resolutions.find(r => r.is_default)
        media.video.resolution = defaultResolution.label
        media.video.width = defaultResolution.width
        media.video.height = defaultResolution.height
        commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
        const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
        await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
      }
      this.$consola.error(err)
    }
  },

  async toggleVideoMuted ({
    commit,
    dispatch,
    getters,
    state
  }) {
    const handleDto = getters.localHandle
    try {
      const media = {
        video: {
          muted: !handleDto.media.video.muted
        }
      }
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto }, { root: true })
      if (handleDto && handleDto.handle && !handleDto.media.video.muted) {
        handleDto.handle.unmuteVideo()
      } else {
        handleDto.handle.muteVideo()
      }
    } catch (e) {
      this.$consola.error(e)
    }
  },

  async setAudio ({
    commit,
    dispatch,
    getters,
    state
  }, device) {
    try {
      const handleDto = getters.localHandle
      const media = {
        audio: {
          device
        }
      }
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
    } catch (e) {
      this.$consola.error(e)
    }
  },

  async setSpeaker ({
    commit,
    dispatch,
    getters,
    state
  }, device) {
    try {
      const handleDto = getters.localHandle
      const media = {
        speakers: {
          device
        }
      }
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto }, { root: true })
      state.session.videoroomHandles.forEach(async (handle) => {
        const video = document.getElementById(handle.id)
        if (video) {
          try {
            await video.setSinkId(device)
          } catch (e) {
            this.$consola.info(e)
          }
        }
      })
      state.session.sipHandles.forEach(async (handle) => {
        const audio = document.getElementById(handle.id)
        if (audio) {
          try {
            await audio.setSinkId(device)
          } catch (e) {
            this.$consola.info(e)
          }
        }
      })
    } catch (err) {
      this.$consola.error(err)
    }
  },

  async toggleAudio ({
    commit,
    dispatch,
    getters,
    state
  }) {
    try {
      const handleDto = getters.localHandle
      const media = {
        audio: {
          enabled: !handleDto.media.audio.enabled
        }
      }
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
    } catch (e) {
      this.$consola.error(e)
    }
  },

  async toggleAudioMuted ({
    commit,
    dispatch,
    getters,
    state
  }) {
    try {
      const handleDto = getters.localHandle
      const sipHandleDto = getters.remoteSipHandle
      const handle = sipHandleDto && sipHandleDto.handle ? sipHandleDto.handle : handleDto.handle
      const media = {
        audio: {
          muted: !handleDto.media.audio.muted
        }
      }
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto }, { root: true })
      if (handle && !handleDto.media.audio.muted) {
        handle.unmuteAudio()
      } else {
        handle.muteAudio()
      }
    } catch (e) {
      this.$consola.error(e)
    }
  },
  async setVideoResolution ({
    commit,
    dispatch,
    getters,
    state
  }, { resolution }) {
    const foundResolution = state.resolutions.find(r => r.label === resolution)
    const handleDto = getters.localHandle
    const media = {
      video: {
        resolution,
        width: foundResolution.width,
        height: foundResolution.height
      }
    }
    try {
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
    } catch (err) {
      if (err.name && err.name.includes('OverconstrainedError')) {
        alert(this.app.i18n.t('comps.conference.overconstrainedError'))
        const defaultResolution = state.resolutions.find(r => r.is_default)
        media.video.resolution = defaultResolution.label
        media.video.width = defaultResolution.width
        media.video.height = defaultResolution.height
        commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
        const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
        await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
      }
      this.$consola.error(err)
    }
  },
  async setBitrateLimit ({
    commit,
    dispatch,
    getters,
    state
  }, bitrateLimit) {
    try {
      const handleDto = getters.localHandle
      commit('api/janus/videoroom/updates/setBitrateLimit', { handleDto, bitrateLimit }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto }, { root: true })
    } catch (e) {
      this.$consola.error(e)
    }
  },

  async publish ({
    commit,
    dispatch,
    getters,
    state
  }, media) {
    try {
      const handleDto = getters.localHandle
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      const jsep = await dispatch('api/janus/videoroom/handle/createOffer', { handleDto }, { root: true })
      await dispatch('api/janus/videoroom/api/configure', { handleDto, jsep }, { root: true })
    } catch (e) {
      this.$consola.error(e)
    }
  },

  async unpublish ({
    commit,
    dispatch,
    getters,
    state
  }) {
    try {
      const handleDto = getters.localHandle
      const media = {
        audio: {
          enabled: false
        },
        video: {
          enabled: false
        },
        screen: {
          enabled: false
        },
        data: {
          enabled: false
        }
      }
      commit('api/janus/videoroom/updates/setMedia', { handleDto, media }, { root: true })
      await dispatch('api/janus/videoroom/api/unpublish', { handleDto }, { root: true })
    } catch (e) {
      this.$consola.error(e)
    }
  }
}

export const getters = {
  localHandle: (state) => {
    return state.session && state.session.videoroomHandles ? state.session.videoroomHandles.find(h => h.isLocal) : null
  },
  localSipHandle: (state) => {
    return state.session && state.session.sipHandles ? state.session.sipHandles.find(h => h.isLocal) : null
  },
  remoteSipHandle: (state) => {
    return state.session && state.session.sipHandles ? state.session.sipHandles.find(h => !h.isLocal) : null
  }
}
