const fp = require('fastify-plugin')
const uuid = require('uuid')
const WebSocket = require('ws')

function fastifyWs (fastify, opts, next) {
  const wss = new WebSocket.Server({
    server: fastify.server,
    verifyClient (info, cb) {
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
              cb(true)
            })
          }
        }
      }
      if (callCallback) {
        cb(true)
      }
    }
  })
  wss.ws_handlers = {
    connection: [],
    message: [],
    close: []
  }
  wss
    .on('connection', (conn, req) => {
      conn.id = uuid()
      if (req.user) {
        conn.user = req.user
        console.log(`WS client: ${conn.user.username}`)
      } else {
        console.log('WS client: ANONYMOUS')
      }
      wss.ws_handlers.connection.forEach((handler) => {
        handler(wss, conn)
      })
      conn.on('message', (msg) => {
        console.log(`WS message received: ${msg}`)
        wss.ws_handlers.message.forEach((handler) => {
          handler(wss, conn, JSON.parse(msg))
        })
      })
      conn.on('close', () => {
        console.log('WS Client disconnected.')
        wss.ws_handlers.close.forEach((handler) => {
          handler(wss, conn)
        })
      })
    })

  fastify.decorate('ws', wss)
  fastify.addHook('onRoute', (routeOptions) => {
    if (routeOptions.wsHandler) {
      console.log('registering ws handler')
      wss.ws_handlers.message.push(routeOptions.wsHandler)
    }
  })

  fastify.addHook('onClose', (fastify, done) => fastify.ws.close(done))

  next()
}

module.exports = fp(fastifyWs, {
  fastify: '>=2.6.0',
  name: 'fastify-ws'
})
