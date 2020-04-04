
import * as uuid from 'uuid/v4'

export const displayToMedia = (display) => {
  // display='username|media' => media=data,audio,video,screen
  // e.g. johnson|audio,video
  const result = {
    display: null,
    display_name: null,
    data: null,
    audio: null,
    video: null,
    screen: null
  }
  result.display = display
  result.display_name = display // default
  if (display) {
    const parts = display.split('|')
    if (parts.length >= 1) {
      result.display_name = parts[0] // override
    }
    if (parts.length >= 2) {
      result.data = parts[1].includes('data')
      result.audio = parts[1].includes('audio')
      result.video = parts[1].includes('video')
      result.screen = parts[1].includes('screen')
    }
  }
  return result
}
export const toHandleDTO = (sessionDTO, args) => {
  const media = displayToMedia(args.display)
  const result = {
    id: args.id || uuid(),
    private_id: args.private_id || uuid(),
    feed: null,
    display: media.display,
    display_name: media.display_name,
    sessionDTO,
    plugin: args.plugin || 'janus.plugin.videoroom',
    roomid: args.roomid || null,
    token: args.token || undefined,

    consentDialog: false,
    webrtcState: false,
    iceState: false,
    iceStateReason: null,
    mediaState: {
      audio: false,
      video: false,
      data: false
    },

    isPublisher: args.isPublisher !== undefined ? args.isPublisher : false,
    isLocal: args.isLocal !== undefined ? args.isLocal : true,

    resolutions: ['lowres', 'lowres-16:9', 'stdres', 'stdres-16:9', 'hires', 'hires-16:9'],
    videoResolution: args.videoResolution !== undefined ? args.videoResolution : 'lowres',

    data: media.data !== undefined ? media.data : false,
    audio: media.audio !== undefined ? media.audio : true,
    video: media.video !== undefined ? media.video : true,
    screen: media.screen !== undefined ? media.screen : false,

    audioCodec: args.audioCodec || null,
    videoCodec: args.videoCodec || null,

    simulcast: args.simulcast !== undefined ? args.simulcast : false,
    iceRestart: args.iceRestart !== undefined ? args.iceRestart : true,
    trickle: args.trickle !== undefined ? args.trickle : true,

    stream: null
  }
  return result
}
