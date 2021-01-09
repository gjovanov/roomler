const fp = require('fastify-plugin')
const mongoose = require('mongoose')

function fastifyMongoose (fastify, options, next) {
  mongoose.connect(options.dbUrl, options.dbOptions)
    .then(() => {
      const mongo = {
        db: mongoose.connection
      }

      fastify
        .decorate('mongo', mongo)
        .addHook('onClose', function (f, done) {
          mongoose.disconnect()
          done()
        })

      next()
    },
    (err) => {
      if (err) {
        return next(err)
      }
      return next()
    })
}

module.exports = fp(fastifyMongoose, {
  fastify: '>=2.6.0',
  name: 'fastify-mongoose'
})
