
import * as uuid from 'uuid/v4'
export const toHandleDTO = (sessionDTO, args) => {
  if (args.display && args.display.includes('|Screenshare')) {
    args.screen = true
  }
  if (args.screen) {
    if (!args.display.includes('|Screenshare')) {
      args.display += '|Screenshare'
    }
    args.video = false
  }
  args.display_name = args.display ? args.display.replace('|Screenshare', '') : args.display

  const result = {
    id: args.id || uuid(),
    private_id: args.private_id || uuid(),
    feed: null,
    display: args.display,
    display_name: args.display_name,
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
    audio: args.audio !== undefined ? args.audio : true,
    video: args.video !== undefined ? args.video : true,
    videoResolution: args.videoResolution !== undefined ? args.videoResolution : 'stdres',
    screen: args.screen !== undefined ? args.screen : false,
    data: args.data !== undefined ? args.data : false,

    audioCodec: args.audioCodec || null,
    videoCodec: args.videoCodec || null,

    simulcast: args.simulcast !== undefined ? args.simulcast : false,
    iceRestart: args.iceRestart !== undefined ? args.iceRestart : true,
    trickle: args.trickle !== undefined ? args.trickle : true,

    stream: null
  }

  return result
}
