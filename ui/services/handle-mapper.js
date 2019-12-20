
import * as uuid from 'uuid/v4'
export const toHandleDTO = (sessionDTO, args) => {
  return {
    id: args.id || uuid(),
    private_id: args.private_id || uuid(),
    feed: null,
    display: args.display,
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

    audio: true,
    video: true,
    data: true,

    sendAudio: args.sendAudio !== undefined ? args.sendAudio : true,
    sendVideo: args.sendVideo !== undefined ? args.sendVideo : true,
    sendData: args.sendData !== undefined ? args.sendData : false,
    sendScreen: args.sendScreen !== undefined ? args.sendScreen : false,

    receiveAudio: args.receiveAudio !== undefined ? args.receiveAudio : true,
    receiveVideo: args.receiveVideo !== undefined ? args.receiveVideo : true,
    receiveData: args.receiveData !== undefined ? args.receiveData : true,

    audioCodec: args.audioCodec || null,
    videoCodec: args.videoCodec || null,

    simulcast: args.simulcast !== undefined ? args.simulcast : false,
    iceRestart: args.iceRestart !== undefined ? args.iceRestart : true,
    trickle: args.trickle !== undefined ? args.trickle : true,

    stream: null
  }
}
