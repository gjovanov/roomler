export const mutations = {
  setCallId (state, { handleDto, callId }) {
    if (callId) {
      handleDto.call_id = callId
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
    this.$Janus.log(`webrtcState: '${on}', ${reason}`)
    handleDto.webrtcState = on
    handleDto.webrtcStateReason = reason
  },
  iceState (state, { handleDto, on }) {
    this.$Janus.log(`iceState: '${on}'`)
    handleDto.iceState = on
  },
  mediaState (state, { handleDto, type, on }) {
    this.$Janus.log(`mediaState: '${on}', ${type}`)
    handleDto.mediaState[type] = on
    if (type === 'video') {
      if (handleDto.media.video.enabled && on) {
        handleDto.mediaState.resolution = handleDto.media.video.resolution
      } else {
        handleDto.mediaState.resolution = null
      }
    }
  },
  slowLink (state, { handleDto, on }) {
    this.$Janus.log(`slowLink: '${on}'`)
    handleDto.slowLink = on
  },
  onlocalstream (state, { handleDto, stream, commit }) {
    handleDto.stream = stream
    handleDto.isLocal = true
  },
  onremotestream (state, { handleDto, stream, commit }) {
    handleDto.stream = stream
    handleDto.isLocal = false
  },
  ondataopen (state, { handleDto }) {
    handleDto.mediaState.data = true
  },
  oncleanup (state, { handleDto }) {
    clearInterval(handleDto.timer)
    handleDto.stream = null
  }
}
