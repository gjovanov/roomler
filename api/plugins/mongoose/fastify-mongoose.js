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
          fastify.log.info('HERE3')
          fastify.mongo.db.close(() => {
            done()
          })
        })

      next()
    },
    (err) => {
      if (err) return next(err)
    })
}

module.exports = fp(fastifyMongoose, '>=2.6.0')
