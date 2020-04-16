
import * as uuid from 'uuid/v4'
import qs from 'qs'

export const defaultMedia = {
  audio: {
    enabled: false,
    muted: false,
    codec: null
  },
  video: {
    enabled: false,
    muted: false,
    codec: null,
    resolution: 'lowres'
  },
  screen: {
    enabled: false,
    muted: false,
    codec: null
  },
  data: {
    enabled: false
  }
}

export function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

export function mergeDeep (target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

export function queryToModel (query) {
  const model = qs.parse(query, {
    decoder (value) {
      if (/^(\d+|\d*\.\d+)$/.test(value)) {
        return parseFloat(value)
      }

      const keywords = {
        true: true,
        false: false,
        null: null,
        undefined
      }
      if (value in keywords) {
        return keywords[value]
      }

      return value
    }
  })
  return model
}

export function modelToQuery (model) {
  const query = qs.stringify(model, { encode: false })
  return query
}

export class HandleDto {
  constructor (sessionDto, args) {
    const displayParts = args && args.display ? args.display.split('?') : []
    const media = displayParts && displayParts.length ? mergeDeep({}, defaultMedia, queryToModel(displayParts[1])) : defaultMedia
    this.media = media
    if (args.audioCodec) {
      this.media.audio.codec = args.audioCodec
    }
    if (args.videoCodec) {
      this.media.video.codec = args.videoCodec
    }
    const mediaPart = modelToQuery(this.media)

    this.id = args.id || uuid()
    this.private_id = args.private_id || uuid()
    this.feed = null
    this.display = `${displayParts[0]}?${mediaPart}`
    this.display_name = displayParts[0]
    this.sessionDto = sessionDto
    this.plugin = args.plugin || 'janus.plugin.videoroom'
    this.roomid = args.roomid || null
    this.token = args.token || undefined

    this.consentDialog = false
    this.webrtcState = false
    this.iceState = false
    this.iceStateReason = null
    this.mediaState = {
      audio: false,
      video: false,
      data: false,
      resolution: null
    }
    this.simulcast = args.simulcast !== undefined ? args.simulcast : false
    this.iceRestart = args.iceRestart !== undefined ? args.iceRestart : true
    this.trickle = args.trickle !== undefined ? args.trickle : true

    this.stream = null
    this.isPublisher = args.isPublisher !== undefined ? args.isPublisher : false
    this.isLocal = args.isLocal !== undefined ? args.isLocal : true
    this.resolutions = ['lowres', 'lowres-16:9', 'stdres', 'stdres-16:9', 'hires', 'hires-16:9']
    this.timer = null
    this.interval = 1000
    this.bitrate = {
      limit: undefined,
      value: '0 KBIT/SEC'
    }
    console.log(this.media)
    console.log(this.display)
    console.log(this.display_name)
  }
}
