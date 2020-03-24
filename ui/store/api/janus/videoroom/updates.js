
export const mutations = {
  setPublisher (state, { handleDTO, isPublisher }) {
    handleDTO.isPublisher = isPublisher
  },
  setMedia (state, { handleDTO, media }) {
    if (media.screen !== undefined) {
      if (media.screen === true) {
        if (!handleDTO.display.includes('|Screenshare')) {
          handleDTO.display += '|Screenshare'
        }
        media.video = false
      }
      if (media.screen === false) {
        handleDTO.display = handleDTO.display.replace('|Screenshare', '')
      }
      handleDTO.screen = media.screen
    }
    if (media.video !== undefined) {
      handleDTO.video = media.video
    }
    if (media.audio !== undefined) {
      handleDTO.audio = media.audio
    }
    if (media.data !== undefined) {
      handleDTO.data = media.data
    }
  },
  clearStream (state, { handleDTO }) {
    console.log('clearStream')
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
  },

  updateIds (state, { handleDTO, msg }) {
    if (msg.id) {
      handleDTO.id = msg.id
    }
    if (msg.private_id) {
      handleDTO.private_id = msg.private_id
    }
    if (msg.display) {
      handleDTO.display = msg.display
      handleDTO.display_name = msg.display.replace('|Screenshare', '')
      const screenshare = handleDTO.display.includes('|Screenshare')
      if (!screenshare) {
        handleDTO.video = true && (msg.video === undefined || msg.video)
        handleDTO.screen = false
      }
      if (screenshare) {
        handleDTO.video = false
        handleDTO.screen = true
      }
    }
  }
}
