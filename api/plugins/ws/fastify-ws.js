const fp = require('fastify-plugin')
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
  wss
    .on('connection', (conn, req) => {
      opts.handlers.handleConnection(wss, conn, req)
      conn.on('message', (msg) => {
        opts.handlers.handleMessage(wss, conn, JSON.parse(msg))
      })
      conn.on('close', () => {
        opts.handlers.handleClose(wss, conn)
      })
    })

  fastify.decorate('ws', wss)

  fastify.addHook('onClose', (fastify, done) => fastify.ws.close(done))

  next()
}

module.exports = fp(fastifyWs, {
  fastify: '>=2.6.0',
  name: 'fastify-ws'
})
