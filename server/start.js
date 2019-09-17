const {
  resolve
} = require('path')
const {
  Nuxt,
  Builder
} = require('nuxt')
const config = require('../nuxt.config')

const nodeEnv = process.env.NODE_ENV || 'development'
const runBuilder = nodeEnv === 'development' || nodeEnv === 'test'
config.dev = nodeEnv === 'development'

const fastify = require('../api/api')()

async function start (port = process.env.PORT || 3000, host = process.env.HOST || '127.0.0.1') {
  // Build only in dev mode
  let nuxt = null
  if (runBuilder) {
    console.log('Bundling....')
    config.rootDir = resolve(__dirname, '../')
    nuxt = new Nuxt(config)
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    nuxt = new Nuxt(config)
    await nuxt.ready()
  }

  // fastify.use(nuxt.render)

  fastify.use((req, res, next) => {
    // let fastify handle api requests
    if (req.url.startsWith('/api') ||
      req.url.startsWith('/docs') ||
      req.url.startsWith('/oauth')) {
      next()
    } else {
      // nuxt handles all other requests
      return nuxt.render(req, res)
    }
  })

  try {
    const address = await fastify.listen(port, host)
    try {
      fastify.swagger()
    } catch (e) {
      console.log('No Swagger')
    }
    console.log(`SERVER is listening at: ${address}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  return {
    fastify,
    nuxt
  }
}

module.exports = start
