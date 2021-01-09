const {
  resolve
} = require('path')
const {
  Nuxt,
  Builder
} = require('nuxt')
const consola = require('consola')

class UiServer {
  constructor () {
    if (!!process.env.NODE_ENV ||
      ['development', 'test'].includes(process.env.NODE_ENV)) {
      require('dotenv').config({ path: '../../.env' })
    }
    this.config = require('./nuxt.config')
    this.nodeEnv = process.env.NODE_ENV || 'development'
    this.runBuilder = this.nodeEnv === 'development' || this.nodeEnv === 'test'
    this.config.dev = this.nodeEnv === 'development'
    this.config.src = __dirname
    this.fastifyBuilder = require('roomler.api')
    this.fastify = null
    this.nuxt = null
  }

  async up (port = process.env.PORT || 3000, host = process.env.HOST || 'localhost') {
    this.fastify = await this.fastifyBuilder()
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
    if (this.runBuilder) {
      consola.info('Bundling....')
      this.config.rootDir = resolve(__dirname)
      this.nuxt = new Nuxt(this.config)
      const builder = new Builder(this.nuxt)
      await builder.build()
    } else {
      this.nuxt = new Nuxt(this.config)
      await this.nuxt.ready()
    }

    try {
      const address = await this.fastify.listen(port, host)
      try {
        this.fastify.swagger()
      } catch (e) {
        consola.error(new Error('No Swagger'))
      }
      consola.success(`UI SERVER '${`${require('os').hostname()}_${require('process').pid}`}' is listening at: ${address}`)
    } catch (err) {
      consola.error(err)
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
