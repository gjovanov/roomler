import { displayToMedia } from '@/services/handle-mapper'

export const mutations = {
  setPublisher (state, { handleDTO, isPublisher }) {
    handleDTO.isPublisher = isPublisher
  },
  setMedia (state, { handleDTO, media }) {
    const mediaPart = ['audio', 'video', 'data', 'screen'].filter(key => media[key] === true).join(',')
    const displayPart = handleDTO.display_name
    handleDTO.display = `${displayPart}|${mediaPart}`
    if (media.data !== undefined) {
      handleDTO.data = media.data
    }
    if (media.audio !== undefined) {
      handleDTO.audio = media.audio
    }
    if (media.video !== undefined) {
      handleDTO.video = media.video
    }
    if (media.screen !== undefined) {
      handleDTO.screen = media.screen
    }
  },
  setDisplay (state, { handleDTO, display }) {
    if (display) {
      const media = displayToMedia(display)
      handleDTO.display = media.display
      handleDTO.display_name = media.display_name
      handleDTO.data = media.data
      handleDTO.audio = media.audio
      handleDTO.video = media.video
      handleDTO.screen = media.screen
      handleDTO.display = media.display
    }
  },
  setId (state, { handleDTO, id, privateId }) {
    if (id) {
      handleDTO.id = id
    }
    if (privateId) {
      handleDTO.private_id = privateId
    }
  },
  clearStream (state, { handleDTO }) {
    handleDTO.stream = null
  },
  consentDialog (state, { handleDTO, on }) {
    handleDTO.consentDialog = on
  },
  webrtcState (state, { handleDTO, on, reason }) {
    console.log(`webrtcState: '${on}', ${reason}`)
    handleDTO.webrtcState = on
    handleDTO.webrtcStateReason = reason
  },
  iceState (state, { handleDTO, on }) {
    console.log(`iceState: '${on}'`)
    handleDTO.iceState = on
  },
  mediaState (state, { handleDTO, type, on }) {
    console.log(`mediaState: '${on}', ${type}`)
    handleDTO.mediaState[type] = on
  },
  slowLink (state, { handleDTO, on }) {
    console.log(`slowLink: '${on}'`)
    handleDTO.slowLink = on
  },
  onlocalstream (state, { handleDTO, stream }) {
    handleDTO.stream = stream
    handleDTO.isLocal = true
  },
  onremotestream (state, { handleDTO, stream }) {
    handleDTO.stream = stream
    handleDTO.isLocal = false
  },
  ondataopen (state, { handleDTO }) {
    handleDTO.mediaState.data = true
  },
  oncleanup (state, { handleDTO }) {
    handleDTO.stream = null
  }
}
