
import * as uuid from 'uuid/v4'
import qs from 'qs'

const defaultMedia = {
  bitrate: {
    limit: undefined,
    value: '0 KBIT/SEC'
  },
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

export class HandleDto {
  constructor (sessionDto, args) {
    const displayParts = args && args.display ? args.display.split('?') : []
    const media = displayParts && displayParts.length ? Object.assign(defaultMedia, this.queryToModel(displayParts[1])) : {}
    this.id = args.id || uuid()
    this.private_id = args.private_id || uuid()
    this.feed = null
    this.display = media.display
    this.display_name = media.display_name
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
      data: false
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
    this.media = media
  }

  queryToModel (query) {
    const model = qs.parse(query)
    return model
  }

  modelToQuery (model) {
    const query = qs.stringify(model, { encode: false })
    return query
  }
}
