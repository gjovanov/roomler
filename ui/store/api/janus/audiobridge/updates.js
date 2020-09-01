import { mergeDeep, modelToQuery, queryToModel, defaultMedia } from '@/services/handle-dto'

export const mutations = {
  setIsMuted (state, { handleDto, type, isMuted }) {
    handleDto.media[type].muted = isMuted
    const mediaPart = modelToQuery(handleDto.media)
    const displayPart = handleDto.display_name
    handleDto.display = `${displayPart}?${mediaPart}`
  },
  setBitrateLimit (state, { handleDto, bitrateLimit }) {
    handleDto.bitrate.limit = bitrateLimit
  },
  setBitrateValue (state, { handleDto, bitrateValue }) {
    handleDto.bitrate.value = bitrateValue
  },
  setPublisher (state, { handleDto, isPublisher }) {
    handleDto.isPublisher = isPublisher
  },
  setMedia (state, { handleDto, media }) {
    const newMedia = mergeDeep({}, handleDto.media, media)
    if (!newMedia.video.enabled) {
      newMedia.video.muted = false
    }
    if (!newMedia.audio.enabled) {
      newMedia.audio.muted = false
    }
    const mediaPart = modelToQuery(newMedia)
    const displayPart = handleDto.display_name
    handleDto.display = `${displayPart}?${mediaPart}`
    handleDto.media = newMedia
  },
  setDisplay (state, { handleDto, display }) {
    if (display) {
      const displayParts = display.split('?')
      const media = displayParts && displayParts.length ? mergeDeep({}, handleDto.media, queryToModel(displayParts[1])) : defaultMedia
      handleDto.display = display
      handleDto.display_name = displayParts[0]
      handleDto.media = media
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

    clearInterval(handleDto.timer)
    handleDto.timer = setInterval(() => {
      if (handleDto.handle && handleDto.handle.webrtcStuff) {
        const bitrateValue = handleDto.handle.getBitrate().replace('kbits/sec', 'kb/s')
        commit('api/janus/audiobridge/updates/setBitrateValue', { handleDto, bitrateValue }, { root: true })
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
