
import { v4 as uuid } from 'uuid'

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
export const toHandleDTO = (sessionDto, args) => {
  const media = displayToMedia(args.display)
  const result = {
    id: args.id || uuid(),
    private_id: args.private_id || uuid(),
    feed: null,
    display: media.display,
    display_name: media.display_name,
    sessionDto,
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
    videoResolution: args.videoResolution !== undefined ? args.videoResolution : 'hires',

    media: {
      bitrate: {
        limit: media.bitrate !== undefined && media.bitrate.limit !== undefined ? media.bitrate.limit : 0,
        value: media.bitrate !== undefined && media.bitrate.value !== undefined ? media.bitrate.value : 0
      },
      audio: {
        enabled: media.audio !== undefined && media.audio.enabled !== undefined ? media.audio.enabled : true,
        muted: media.audio !== undefined && media.audio.muted !== undefined ? media.audio.muted : true,
        codec: media.audio !== undefined && media.audio.codec !== undefined ? media.audio.codec : null
      },
      video: {
        enabled: media.video !== undefined && media.video.enabled !== undefined ? media.video.enabled : true,
        muted: media.video !== undefined && media.video.muted !== undefined ? media.video.muted : true,
        codec: media.video !== undefined && media.video.codec !== undefined ? media.video.codec : null,
        resolution: media.video !== undefined && media.video.resolution !== undefined ? media.video.resolution : 'lowres'
      },
      screen: {
        enabled: media.video !== undefined && media.video.enabled !== undefined ? media.video.enabled : true,
        muted: media.video !== undefined && media.video.muted !== undefined ? media.video.muted : true,
        codec: media.video !== undefined && media.video.codec !== undefined ? media.video.codec : null
      },
      data: {

      }
    },

    data: media.data !== undefined ? media.data : false,
    audio: media.audio !== undefined ? media.audio : true,
    video: media.video !== undefined ? media.video : true,
    screen: media.screen !== undefined ? media.screen : false,

    isAudioMuted: false,
    isVideoMuted: false,

    timer: null,
    interval: 1000,
    bitrate: null, // bitrate set in Janus the limit
    currentBitrate: null, // bitrate read from Janus

    audioCodec: args.audioCodec || null,
    videoCodec: args.videoCodec || null,

    simulcast: args.simulcast !== undefined ? args.simulcast : false,
    iceRestart: args.iceRestart !== undefined ? args.iceRestart : true,
    trickle: args.trickle !== undefined ? args.trickle : true,

    stream: null
  }
  return result
}
