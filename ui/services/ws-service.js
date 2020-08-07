
import cookies from 'js-cookie'
import consola from 'consola'
import TrackingService from './tracking-service'

// readyState
// 0 - CONNECTING - Socket has been created. The connection is not yet open.
// 1 - OPEN - The connection is open and ready to communicate.
// 2 - CLOSING - The connection is in the process of closing.
// 3 - CLOSED - The connection is closed or couldn't be opened.
class WsService {
  constructor (host, store, router) {
    this.trackingService = new TrackingService(store)
    this.counter = 0 // used as reconnect counter
    this.host = host
    this.store = store
    this.router = router
    this.subscriptions = {
      onopen: [],
      onclose: [],
      onerror: [],
      onmessage: []
    }
    this.visits = []
    this.messages = []

    this.closedCode = 3000
    this.reconnectInterval = 3000
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
      this.ws.close(self.closedCode)
    }
    this.ws = new WebSocket(`${this.host}`)

    this.ws.onopen = async (event) => {
      consola.info(`WebSocket opened: ${event}`)

      // update device information
      self.trackingService.connectionUpdate()
      setTimeout(() => {
        self.trackingService.openVisit()
      }, 200)

      while (self.messages.length > 0) {
        self.ws.send(self.messages.pop())
      }

      if (self.counter >= 0 && cookies.get('token')) {
        if (self.store.state.api.auth.user && self.store.state.api.auth.user._id) {
          await self.store.dispatch('api/auth/me')
            .then(() => {
              return Promise.all([
                self.store.dispatch('api/invite/acceptPendingInvites'),
                self.store.dispatch('api/invite/acceptPendingJoins', self.store.state.api.auth.user._id)
              ])
            })
            .then(() => {
              return Promise.all([
                self.store.dispatch('api/room/getAll')
              ])
            })
            .then(() => {
              if (self.router.currentRoute.params && self.router.currentRoute.params.room) {
                self.store.commit('api/room/setRoom', self.store.getters['api/room/selectedRoom'](self.router.currentRoute.params.room), { root: true })
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
      if (event.code !== self.closedCode) {
        setTimeout(() => {
          self.connect(self.host)
        }, self.reconnectInterval)
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
}
export default WsService
