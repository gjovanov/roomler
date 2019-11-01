// readyState
// 0 - CONNECTING - Socket has been created. The connection is not yet open.
// 1 - OPEN - The connection is open and ready to communicate.
// 2 - CLOSING - The connection is in the process of closing.
// 3 - CLOSED - The connection is closed or couldn't be opened.
class WsService {
  constructor (host, token) {
    this.host = host
    this.token = token
    this.subscriptions = {
      onopen: [],
      onclose: [],
      onerror: [],
      onmessage: []
    }
  }

  subscribe (name, handler) {
    this.subscriptions[name].push(handler)
  }

  unsubscribe (name, handler) {
    this.subscriptions[name] = this.subscriptions[name].filter(h => h !== handler)
  }

  connect () {
    const self = this
    console.log('Trying to open Web Socket...')
    if (this.ws) {
      console.log('Closing existing Web Socket...')
      this.ws.close(1000)
    }
    this.ws = new WebSocket(`${this.host}`)

    this.ws.onopen = (event) => {
      console.log(`WebSocket opened: ${event}`)
      self.subscriptions.onopen.forEach((handler) => {
        handler(event)
      })
    }
    this.ws.onclose = (event) => {
      console.log(`WebSocket closed: ${JSON.stringify(event.code)}`)
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
      console.log(`WebSocket error: ${event}`)
      self.subscriptions.onerror.forEach((handler) => {
        handler(event)
      })
    }

    this.ws.onmessage = (msg) => {
      console.log(msg.data)
      self.subscriptions.onmessage.forEach((handler) => {
        handler(event)
      })
    }
  }

  send (msg) {
    this.ws.send(msg)
  }
}
export default WsService
