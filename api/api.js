const buildApi = function () {
  const fastify = require('fastify')({
    logger: true
  })
  const jwtOptions = require('./plugins/jwt-options')

  fastify
    .setErrorHandler(require('./errors/error-handler'))
    .register(require('fastify-swagger'), require('./plugins/swagger-options'))
    .register(require('fastify-jwt'), jwtOptions)
    .register(require('./plugins/mongoose'), require('./plugins/mongoose-options'))
    .decorate('authenticate', async (request, reply) => {
      await request.jwtVerify(jwtOptions)
    })
    .decorate('verifyToken', async (request, reply) => {
      const userService = require('./services/user/user-service')
      await userService.verify(request.user.user)
    })
    .after(() => {
      // register routes
      const routes = require('./routes')
      routes.forEach((route) => {
        if (route.authenticate) {
          route.preValidation = [
            fastify.authenticate,
            fastify.verifyToken
          ]
        }
        fastify.route(route)
      })
    })

  return fastify
}

module.exports = buildApi
