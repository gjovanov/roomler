import { config } from '~/../config'
import * as Janus from '~/lib/janus'
import { HandleFactory } from '~/services/janus/handle-factory'

export default class Session {
  constructor (args) {
    this.init = false
    this.session = null
    this.handles = []
  }

  init (debug = true) {
    const self = this
    return new Promise((resolve) => {
      Janus.init({
        debug: debug,
        callback: () => {
          this.init = true
          resolve(self)
        }
      })
    })
  }

  create () {
    const self = this
    return new Promise((resolve, reject) => {
      const session = new Janus({
        server: config.settings.janusServerUrl,
        iceServers: config.iceServers,
        success: () => {
          this.session = session
          resolve(self)
        },
        error: (error) => {
          reject(error)
        },
        destroyed: () => {
          console.log(`Janus session destroyed`)
        }
      })
    })
  }

  attach (args) {
    const self = this
    return new Promise((resolve, reject) => {
      args.session = self
      const handle = HandleFactory.create(args)
      self.janus.attach({
        plugin: args.plugin,
        opaqueId: args.opaqueId,
        success: (result) => {
          handle.handle = result
          self.handles.push(handle)
          resolve(handle)
        },
        error: (error) => {
          reject(error)
        },
        consentDialog: (on) => {
          handle.consentDialog(on)
        },
        webrtcState: (on, reason) => {
          handle.webrtcState(on, reason)
        },
        iceState: (on) => {
          handle.iceState(on)
        },
        mediaState: (type, on) => {
          handle.mediaState(type, on)
        },
        slowLink: (on) => {
          handle.slowLink(on)
        },
        onlocalstream: (stream) => {
          handle.onlocalstream(stream)
        },
        onremotestream: (stream) => {
          handle.onremotestream(stream)
        },
        ondataopen: () => {
          handle.ondataopen()
        },
        ondata: (data) => {
          handle.ondata(data)
        },
        oncleanup: () => {
          handle.oncleanup()
        },
        detached: () => {
          handle.detached()
        },
        onmessage: (msg, jsep) => {
          handle.onmessage(msg, jsep)
        }
      })
    })
  }

  detach (args) {
    const self = this
    return new Promise((resolve, reject) => {
      args.handle.handle.detach({
        success () {
          resolve(self.session)
        },
        error (error) {
          reject(error)
        }
      })
    })
  }
}
