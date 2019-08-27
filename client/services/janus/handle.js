import { config } from '~/../config'
import * as uuid from 'uuid/v4'

export default class Handle {
  constructor (args) {
    if (!args.session) {
      throw new Error('Session is required!')
    }
    this.session = args.session
    this.handle = null
    this.handleid = uuid()

    this.display = args.display || 'Unknown'
    this.ptype = args.ptype || 'publisher'
    this.plugin = args.plugin || config.plugins.videoroom

    this.id = null
    this.myprivateid = args.myprivateid || null
    this.opaqueId = args.opaqueId || 'room-' + this.session.Janus.randomString(12)
    this.isPublisher = false

    this.sendAudio = args.sendAudio !== undefined ? args.sendAudio : true
    this.sendVideo = args.sendVideo !== undefined ? args.sendVideo : true
    this.sendData = args.sendData !== undefined ? args.sendData : true
    this.sendScreen = args.sendScreen !== undefined ? args.sendScreen : false

    this.receiveAudio = args.receiveAudio !== undefined ? args.receiveAudio : true
    this.receiveVideo = args.receiveVideo !== undefined ? args.receiveVideo : true
    this.receiveData = args.receiveData !== undefined ? args.receiveData : true

    this.simulcast = args.simulcast !== undefined ? args.simulcast : false
    this.iceRestart = args.iceRestart !== undefined ? args.iceRestart : true
    this.trickle = args.trickle !== undefined ? args.trickle : true

    this.stream = null
    this.streamUrl = null
  }

  consentDialog (on) {
    console.log(`Consent dialog: state=${on}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
  }

  webrtcState (on, reason) {
    console.log(`WebRTC State: state=${on}, reason=${reason}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
  }

  iceState (on) {
    console.log(`ICE State: state=${on}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
  }

  mediaState (type, on) {
    console.log(`Media state: type=${type}, state=${on}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
  }

  slowLink (on) {
    console.log(`Slow link: state=${on}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
  }

  onlocalstream (stream) {
    console.log(`Local Stream: ${stream} - display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
    this.stream = stream
    this.streamUrl = URL !== undefined ? URL.createObjectURL(stream) : null
    this.islocal = true
  }

  onremotestream (stream) {
    console.log(`Remote Stream: ${stream} - display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
    this.stream = stream
    this.streamUrl = URL !== undefined ? URL.createObjectURL(stream) : null
    this.islocal = false
  }

  ondataopen () {
    console.log(`Data channel open: display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
  }

  ondata (data) {
    const msg = JSON.parse(data)
    console.log(`Data channel received: data=${JSON.stringify(msg)}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
  }

  oncleanup () {
    console.log(`Cleaned up! - display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
    this.stream = null
    this.streamUrl = null
  }

  detached () {
    console.log(`Detached! - display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
  }

  onmessage (msg, jsep) {
    console.log(`Message received: msg=${JSON.stringify(msg)}, jsep=${JSON.stringify(jsep)}, display=${this.display}, plugin=${this.plugin}, id=${this.id}`)
    this.joinedHandler(msg)
    this.publishersHandler(msg)
    this.configuredHandler(msg)
    this.leavingHandler(msg)
    this.unpublishedHandler(msg)
    this.attachedHandler(msg)
    this.jsepHandler(jsep)
    this.destroyedHandler(msg)
    this.errorHandler(msg)
  }

  joinedHandler (msg) {
    // needs to be overriden in the specific plugin
  }

  publishersHandler (msg) {
    // needs to be overriden in the specific plugin
  }

  configuredHandler (msg) {
    // needs to be overriden in the specific plugin
  }

  leavingHandler (msg) {
    // needs to be overriden in the specific plugin
  }

  unpublishedHandler (msg) {
    // needs to be overriden in the specific plugin
  }

  attachedHandler (msg) {
    // needs to be overriden in the specific plugin
  }

  jsepHandler (jsep) {
    // needs to be overriden in the specific plugin
  }

  destroyedHandler (msg) {
    // needs to be overriden in the specific plugin
  }

  errorHandler (msg) {
    // needs to be overriden in the specific plugin
  }
}
