
import { v4 as uuid } from 'uuid'
import cookies from 'js-cookie'
import consola from 'consola'

import DeviceDetector from './device-detector'
import HistoryPatch from './history-patch'

// readyState
// 0 - CONNECTING - Socket has been created. The connection is not yet open.
// 1 - OPEN - The connection is open and ready to communicate.
// 2 - CLOSING - The connection is in the process of closing.
// 3 - CLOSED - The connection is closed or couldn't be opened.
class WsService {
  constructor (host, store) {
    const self = this
    this.detector = new DeviceDetector()
    this.historyPatch = new HistoryPatch() // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
    this.os = this.detector.getOs()
    this.browser = this.detector.getBrowser()
    this.deviceId = cookies.get('device_id')
    if (!this.deviceId) {
      this.deviceId = uuid()
      cookies.set('device_id', this.deviceId, { expires: 365 * 18 })
    }
    this.counter = 0 // used as reconnect counter
    this.host = host
    this.store = store
    this.subscriptions = {
      onopen: [],
      onclose: [],
      onerror: [],
      onmessage: []
    }
    this.visits = []
    this.messages = []
    window.addEventListener('locationchange', () => {
      self.sendVisit()
    })
  }

  subscribe (name, handler) {
    this.subscriptions[name].push(handler)
  }

  unsubscribe (name, handler) {
    this.subscriptions[name] = this.subscriptions[name].filter(h => h !== handler)
  }

  connect () {
    const self = this
    consola.info('Trying to open Web Socket...')
    if (this.ws) {
      consola.info('Closing existing Web Socket...')
      this.ws.close(3000)
    }
    this.ws = new WebSocket(`${this.host}`)

    this.ws.onopen = (event) => {
      consola.info(`WebSocket opened: ${event}`)
      self.sendDeviceInfo()
      while (self.messages.length > 0) {
        self.ws.send(self.messages.pop())
      }

      if (self.counter > 0 && cookies.get('token')) {
        if (self.store.state.api.auth.user && self.store.state.api.auth.user._id) {
          self.store.dispatch('api/auth/me')
            .then(() => {
              return Promise.all([
                self.store.dispatch('api/invite/acceptPendingInvites'),
                self.store.dispatch('api/invite/acceptPendingJoins', self.store.state.api.auth.user._id)
              ])
            })
            .then(() => {
              return Promise.all([
                self.store.dispatch('api/room/getAll'),
                self.store.dispatch('api/auth/getPeers')
              ])
            })
            .then((data) => {
              if (data && data[0] && data[0].result) {
                return Promise.all([self.store.dispatch('api/room/calls/getAll'), ...data[0].result.map(room => self.store.dispatch('api/message/getAll', { room }))])
              }
            })
        }
      }
      self.subscriptions.onopen.forEach((handler) => {
        handler(event)
      })
      self.counter++
    }
    this.ws.onclose = (event) => {
      consola.info(`WebSocket closed: ${JSON.stringify(event.code)}`)
      self.subscriptions.onclose.forEach((handler) => {
        handler(event)
      })
      if (event.code !== 1000) {
        setTimeout(() => {
          self.connect(self.host)
        }, 2000)
      }
    }

    this.ws.onerror = (event) => {
      consola.info(`WebSocket error: ${event}`)
      self.subscriptions.onerror.forEach((handler) => {
        handler(event)
      })
    }

    this.ws.onmessage = (msg) => {
      self.subscriptions.onmessage.forEach((handler) => {
        handler(msg)
      })
    }
  }

  send (msg) {
    if (this.ws.readyState !== 1) {
      this.messages.push(msg)
    } else {
      this.ws.send(msg)
    }
  }

  sendDeviceInfo () {
    const self = this
    self.send(JSON.stringify({
      op: 'CONNECTION_UPDATE',
      payload: {
        device_id: this.deviceId,
        os: {
          name: this.os.name,
          version: this.os.version
        },
        browser: {
          name: this.browser.name,
          version: this.browser.version,
          is_mobile: this.browser.isMobileDevice
        }
      }
    }))
  }

  sendVisit () {
    const self = this
    self.visits.push({
      url: window.location.href,
      referrer: document.referrer
    })
    self.send(JSON.stringify({
      op: 'VISIT_OPEN',
      payload: {
        url: window.location.href,
        referrer: document.referrer
      }
    }))
  }
}
export default WsService
