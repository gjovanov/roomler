'use strict'

const fp = require('fastify-plugin')
const parallel = require('fastparallel')()

function fastifyGracefulShutdown (fastify, opts, next) {
  const logger = fastify.log.child({ plugin: 'fastify-graceful-shutdown' })
  const handlers = []
  const timeout = opts.timeout || 100000
  const signals = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM']

  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i]
    if (process.listenerCount(signal) > 0) {
      next(
        new Error(
          `${signal} handler was already registered use fastify.gracefulShutdown`
        )
      )
      return
    }
  }

  function completed (err, signal) {
    if (err) {
      logger.error({ err, signal }, 'process terminated')
      process.exit(1)
    } else {
      logger.info({ signal }, 'process terminated')
      process.exit(0)
    }
  }

  function terminateAfterTimeout (signal, timeout) {
    setTimeout(() => {
      logger.error(
        { signal, timeout },
        'terminate process after timeout'
      )
      process.exit(1)
    }, timeout).unref()
  }

  function shutdown (signal) {
    parallel(null, handlers, signal, err => completed(err, signal))
  }

  function addHandler (handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('Expected a function but got a ' + typeof handler)
    }
    handlers.push(handler)
  }

  fastify.decorate('gracefulShutdown', addHandler)

  // shutdown fastify
  addHandler((signal, cb) => {
    logger.info({ signal }, 'triggering close hook')
    fastify.close(cb)
  })

  // register handlers
  signals.forEach((signal) => {
    process.once(signal, () => {
      terminateAfterTimeout(signal, timeout)
      logger.info({ signal }, 'received signal')
      shutdown(signal)
    })
  })

  next()
}

module.exports = fp(fastifyGracefulShutdown, '>=2.6.0')
