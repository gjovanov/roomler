const {
  resolve
} = require('path')
const {
  Nuxt,
  Builder
} = require('nuxt')
const config = require('../../nuxt.config')
const nodeEnv = process.env.NODE_ENV || 'development'
const runBuilder = nodeEnv === 'development' || nodeEnv === 'test'
config.dev = nodeEnv === 'development'

class UiServer {
  constructor () {
    this.fastify = require('../../api/api')()
    this.nuxt = null
  }

  async up (port = process.env.PORT || 3000, host = process.env.HOST || 'localhost') {
    if (runBuilder) {
      console.log('Bundling....')
      config.rootDir = resolve(__dirname, '..', '..')
      this.nuxt = new Nuxt(config)
      const builder = new Builder(this.nuxt)
      await builder.build()
    } else {
      this.nuxt = new Nuxt(config)
      await this.nuxt.ready()
    }

    this.fastify.use((req, res, next) => {
      // let fastify handle api requests
      if (req.url.startsWith('/api') ||
        req.url.startsWith('/docs') ||
        req.url.startsWith('/oauth/login')) {
        next()
      } else {
        // nuxt handles all other requests
        return this.nuxt.render(req, res)
      }
    })

    try {
      const address = await this.fastify.listen(port, host)
      try {
        this.fastify.swagger()
      } catch (e) {
        console.log('No Swagger')
      }
      console.log(`UI SERVER is listening at: ${address}`)
    } catch (err) {
      this.fastify.log.error(err)
      process.exit(1)
    }
    return {
      fastify: this.fastify,
      nuxt: this.nuxt
    }
  }

  async down () {
    await this.fastify.close()
  }
}

module.exports = new UiServer()
