const buildApi = function () {
  const fastify = require('fastify')({
    logger: process.env.NODE_ENV !== 'test'
    // http2: true,
    // https: require('./plugins/https-options')
  })
  const jwtOptions = require('./plugins/jwt-options')
  const facebookOptions = require('./plugins/oauth/facebook-options')
  const githubOptions = require('./plugins/oauth/github-options')
  const linkedinOptions = require('./plugins/oauth/linkedin-options')
  fastify
    .setErrorHandler(require('./errors/error-handler'))
    .register(require('fastify-swagger'), require('./plugins/swagger-options'))
    .register(require('fastify-cookie'))
    .register(require('fastify-cors'), require('./plugins/http-proxy-options'))
    .register(require('fastify-jwt'), jwtOptions)
    .register(require('./plugins/mongoose'), require('./plugins/mongoose-options'))
  if (facebookOptions.credentials.client.id) {
    fastify.register(require('fastify-oauth2'), facebookOptions)
  }
  if (githubOptions.credentials.client.id) {
    fastify.register(require('fastify-oauth2'), githubOptions)
  }
  if (linkedinOptions.credentials.client.id) {
    fastify.register(require('fastify-oauth2'), linkedinOptions)
  }
  fastify
    .decorate('authenticate', async (request, reply) => {
      if (request.cookies.token) {
        const user = await fastify.jwt.verify(request.cookies.token, jwtOptions)
        request.user = user
      } else {
        await request.jwtVerify(jwtOptions)
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
