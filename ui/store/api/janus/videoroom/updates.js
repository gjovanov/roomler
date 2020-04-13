import { displayToMedia } from '@/services/handle-mapper'

export const mutations = {
  setIsMuted (state, { handleDto, type, isMuted }) {
    handleDto[`is${type}Muted`] = isMuted
  },
  setCurrentBitrate (state, { handleDto, currentBitrate }) {
    handleDto.currentBitrate = currentBitrate
  },
  setPublisher (state, { handleDto, isPublisher }) {
    handleDto.isPublisher = isPublisher
  },
  setMedia (state, { handleDto, media }) {
    const mediaPart = ['audio', 'video', 'data', 'screen'].filter(key => media[key] === true).join(',')
    const displayPart = handleDto.display_name
    handleDto.display = `${displayPart}|${mediaPart}`
    if (media.data !== undefined) {
      handleDto.data = media.data
    }
    if (media.audio !== undefined) {
      handleDto.audio = media.audio
    }
    if (media.video !== undefined) {
      handleDto.video = media.video
    }
    if (media.screen !== undefined) {
      handleDto.screen = media.screen
    }
  },
  setDisplay (state, { handleDto, display }) {
    if (display) {
      const media = displayToMedia(display)
      handleDto.display = media.display
      handleDto.display_name = media.display_name
      handleDto.data = media.data
      handleDto.audio = media.audio
      handleDto.video = media.video
      handleDto.screen = media.screen
      handleDto.display = media.display
    }
  },
  setId (state, { handleDto, id, privateId }) {
    if (id) {
      handleDto.id = id
    }
    if (privateId) {
      handleDto.private_id = privateId
    }
  },
  clearStream (state, { handleDto }) {
    clearInterval(handleDto.timer)
    handleDto.stream = null
  },
  consentDialog (state, { handleDto, on }) {
    handleDto.consentDialog = on
  },
  webrtcState (state, { handleDto, on, reason }) {
    console.log(`webrtcState: '${on}', ${reason}`)
    handleDto.webrtcState = on
    handleDto.webrtcStateReason = reason
  },
  iceState (state, { handleDto, on }) {
    console.log(`iceState: '${on}'`)
    handleDto.iceState = on
  },
  mediaState (state, { handleDto, type, on }) {
    console.log(`mediaState: '${on}', ${type}`)
    handleDto.mediaState[type] = on
  },
  slowLink (state, { handleDto, on }) {
    console.log(`slowLink: '${on}'`)
    handleDto.slowLink = on
  },
  onlocalstream (state, { handleDto, stream, commit }) {
    handleDto.stream = stream
    handleDto.isLocal = true
  },
  onremotestream (state, { handleDto, stream, commit }) {
    handleDto.stream = stream
    handleDto.isLocal = false

    clearInterval(handleDto.timer)
    handleDto.timer = setInterval(() => {
      if (handleDto.handle && handleDto.handle.webrtcStuff) {
        const currentBitrate = handleDto.handle.getBitrate()
        commit('api/janus/videoroom/updates/setCurrentBitrate', { handleDto, currentBitrate }, { root: true })
      }
    }, handleDto.interval)
  },
  ondataopen (state, { handleDto }) {
    handleDto.mediaState.data = true
  },
  oncleanup (state, { handleDto }) {
    clearInterval(handleDto.timer)
    handleDto.stream = null
  }
}
