const fp = require('fastify-plugin')
const WebSocket = require('ws')
const Redis = require('ioredis')

const startHeartbeats = (wss, conn, opts) => {
  const noop = () => {}
  const handlePong = function () {
    this.isAlive = true
  }
  conn.isAlive = true
  conn.on('pong', handlePong)
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        return ws.terminate()
      }

      ws.isAlive = false
      ws.ping(noop)
    })
  }, parseInt(opts.pingInterval))
  return interval
}

const verify = (fastify, opts) => (info, cb) => {
  const cookie = info.req.headers.cookie
  let callCallback = true
  if (cookie) {
    let token = cookie.split(';').find(function (item) {
      return item.includes('token=')
    })
    if (token) {
      token = token.trim().toString().replace('token=', '')
      if (token) {
        callCallback = false
        fastify.jwt.verify(token, opts.jwt, function (err, decoded) {
          if (!err) {
            info.req.user = decoded.user // [1]
          }
          // eslint-disable-next-line standard/no-callback-literal
          cb(true)
        })
      }
    }
  }
  if (callCallback) {
    // eslint-disable-next-line standard/no-callback-literal
    cb(true)
  }
}

function fastifyWs (fastify, opts, next) {
  if (opts.scaleout && opts.scaleout.enabled) {
    if (!fastify.scaleout) {
      fastify.decorate('scaleout', {})
      if (fastify.scaleout.publisher) {
        return next(new Error('Redis \'publisher\' instance namespace has already been registered'))
      }
      if (fastify.scaleout.subscriber) {
        return next(new Error('Redis \'subscriber\' instance namespace has already been registered'))
      }
      try {
        const publisher = new Redis(opts.scaleout.publisher)
        fastify.scaleout.publisher = publisher
        if (opts.dispatcher && opts.dispatcher.initPublisher) {
          opts.dispatcher.initPublisher(publisher)
        }
      } catch (err) {
        return next(err)
      }
      try {
        const subscriber = new Redis(opts.scaleout.subscriber)
        subscriber.subscribe(opts.scaleout.channel)
          .then(() => {
            subscriber.on('message', (channel, payload) => {
              const data = JSON.parse(payload)
              if (channel === opts.scaleout.channel && opts.dispatcher) { // && data.process !== processName
                fastify.log.info(`SUBSCRIPTION MESSAGE: ${data.op}`)
                opts.dispatcher.dispatch(data.op, data.messages)
              }
            })
          })

        fastify.scaleout.subscriber = subscriber
      } catch (err) {
        return next(err)
      }
    }
  }
  const wss = new WebSocket.Server({
    server: fastify.server,
    verifyClient: verify(fastify, opts)
  })
  wss
    .on('connection', (conn, req) => {
      // start the connection Hearbeats with PING/PONG messages
      const interval = startHeartbeats(wss, conn, opts)
      if (opts.handler) {
        opts.handler.onConnection(fastify, wss, conn, req)

        // on WS message (command):
        // 1. handle command message e.g. store to the DB
        // 2. dispatch events to proper recepients
        // 3. scaleout to other WS servers
        conn.on('message', async (msg) => {
          const message = JSON.parse(msg)
          await opts.handler.onMessage(fastify, wss, conn, req, message)
        })

        conn.on('close', () => {
          // clear the ping/pong interval
          clearInterval(interval)

          opts.handler.onClose(fastify, wss, conn, req)
        })
      }
    })

  fastify.decorate('ws', wss)

  fastify.addHook('onClose', (fi, done) => {
    opts.handler.onShutdown(fastify, wss)
    if (fastify.scaleout) {
      fastify.scaleout.publisher.quit()
      fastify.scaleout.subscriber.quit()
    }
    fastify.ws.close(done)
  })

  next()
}

module.exports = fp(fastifyWs, {
  fastify: '>=2.6.0',
  name: 'fastify-ws'
})
