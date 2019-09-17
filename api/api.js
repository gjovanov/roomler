const buildApi = function () {
  const fastify = require('fastify')({
    logger: {
      level: 'info'
    }
    // process.env.NODE_ENV !== 'test' // true
  })
  const jwtOptions = require('./plugins/jwt-options')

  fastify
    .setErrorHandler(require('./errors/error-handler'))
    .register(require('fastify-swagger'), require('./plugins/swagger-options'))
    .register(require('fastify-cookie'))
    .register(require('fastify-http-proxy'), require('./plugins/http-proxy-options'))
    // .register(require('fastify-cors'), require('./plugins/cors-options'))
    .register(require('fastify-oauth2'), require('./plugins/facebook-options'))
    .register(require('fastify-jwt'), jwtOptions)
    .register(require('./plugins/mongoose'), require('./plugins/mongoose-options'))
    .decorate('authenticate', async (request, reply) => {
      try {
        const user = await fastify.jwt.verify(request.cookies.token, jwtOptions)
        console.log(`USER from token: ${user}`)
        request.user = user
      } catch (error) {
        console.log('Verifying Headers')
        const jwt = await request.jwtVerify(jwtOptions)
        console.log(jwt)
      }
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
