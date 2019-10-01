import HandleFactory from '@/services/janus/handle-factory'
const config = require('@@/config')
export default class Session {
  constructor (Janus) {
    this.is_init = false
    this.session = null
    this.handles = []
    this.Janus = Janus
  }

  init (debug = true) {
    const self = this
    return new Promise((resolve) => {
      if (!self.is_init) {
        self.Janus.init({
          debug,
          callback: () => {
            self.is_init = true
            resolve(self)
          }
        })
      } else {
        resolve(self)
      }
    })
  }

  create () {
    const self = this
    return new Promise((resolve, reject) => {
      const session = new self.Janus({
        server: config.janusSettings.url,
        iceServers: config.iceServers,
        success: () => {
          self.session = session
          resolve(self)
        },
        error: (error) => {
          reject(error)
        },
        destroyed: () => {
          console.log('Janus session destroyed')
        }
      })
    })
  }

  attach (args) {
    const self = this
    return new Promise((resolve, reject) => {
      args.session = self
      const handle = HandleFactory.create(args)
      self.session.attach({
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
          const index = self.handles.indexOf(args.handle)
          self.handles.splice(index, 1)
          resolve(self.session)
        },
        error (error) {
          reject(error)
        }
      })
    })
  }

  async destroy () {
    const self = this
    await Promise.all(self.handles.map(handle => self.detach({
      handle
    })))
    self.session.destroy()
    self.session = null
    return self
  }
}
