export const actions = {
  async onmessage ({
    commit,
    dispatch
  }, { handleDto, msg, jsep }) {
    this.$Janus.log(`onmessage: ${JSON.stringify(msg)}`)
    if (msg.call_id) {
      this.$Janus.log('onmessage:call_id')
    }
    if (msg.sip === 'event' && msg.result) {
      const result = msg.result
      const event = msg.result.event
      this.$Janus.log('onmessage:event')
      if (event === 'registered') {
        await dispatch('handleRegistered', { handleDto, jsep })
      }
      if (event === 'calling') {
        await dispatch('handleCalling', { handleDto, result })
      }
      if (event === 'incomingcall') {
        await dispatch('handleIncomingCall', { handleDto, result })
      }
      if (event === 'accepting') {
        await dispatch('handleAccepting', { handleDto, result })
      }
      if (event === 'progress') {
        await dispatch('handleProgress', { handleDto, result, jsep })
      }
      if (event === 'accepted') {
        await dispatch('handleAccepted', { handleDto, result, jsep })
      }
      if (event === 'updatingcall') {
        await dispatch('handleUpdatingCall', { handleDto, result })
      }
      if (event === 'message') {
        await dispatch('handleMessage', { handleDto, result })
      }
      if (event === 'info') {
        await dispatch('handleInfo', { handleDto, result })
      }
      if (event === 'transfer') {
        await dispatch('handleTransfer', { handleDto, result })
      }
      if (event === 'hangup') {
        await dispatch('handleHangup', { handleDto, result })
      }
      if (result.srtp) {
        await dispatch('handleSrtp', { handleDto, result })
      }
    }

    if (msg.error) {
      this.$Janus.log('onmessage:error')
      await dispatch('handleError', { handleDto, error: msg.error })
    }
  },

  async handleRegistered ({
    commit,
    dispatch
  }, { handleDto, jsep }) {
    this.$Janus.log('handleRegistered')
    if (jsep) {
      await dispatch('api/janus/sip/handle/createAnswer', { handleDto, jsep }, { root: true })
    } else {
      const freshJsep = await dispatch('api/janus/sip/handle/createOffer', { handleDto }, { root: true })
      dispatch('api/janus/sip/api/call', { handleDto, jsep: freshJsep }, { root: true })
    }
  },
  handleCalling ({
    commit,
    dispatch
  }, { handleDto, result }) {
    this.$Janus.log('handleCalling')
  },
  handleIncomingCall ({
    commit,
    dispatch
  }, { handleDto, result }) {
    this.$Janus.log('handleIncomingCall')
  },
  handleAccepting ({
    commit,
    dispatch
  }, { handleDto, result }) {
    this.$Janus.log('handleAccepting')
  },
  handleProgress ({
    commit,
    dispatch
  }, { handleDto, result, jsep }) {
    this.$Janus.log('handleProgress')
    handleDto.handle.handleRemoteJsep({ jsep })
  },
  handleAccepted ({
    commit,
    dispatch
  }, { handleDto, result, jsep }) {
    this.$Janus.log('handleAccepted')
    handleDto.handle.handleRemoteJsep({ jsep })
  },
  handleUpdatingCall ({
    commit,
    dispatch
  }, { handleDto, result }) {
    this.$Janus.log('handleUpdatingCall')
  },
  handleMessage ({
    commit,
    dispatch
  }, { handleDto, result }) {
    this.$Janus.log('handleMessage')
  },
  handleInfo ({
    commit,
    dispatch
  }, { handleDto, result }) {
    this.$Janus.log('handleInfo')
  },
  handleTransfer ({
    commit,
    dispatch
  }, { handleDto, result }) {
    this.$Janus.log('handleTransfer')
  },
  handleHangup ({
    commit,
    dispatch
  }, { handleDto, result }) {
    this.$Janus.log('handleHangup')
  },

  handleError ({
    commit,
    dispatch
  }, { handleDto, error }) {
    this.$Janus.log(`JANUS ERROR: ${error}`)
    // TODO: Add proper housekeeping logic
  }
}
