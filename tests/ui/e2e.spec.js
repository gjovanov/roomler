import test from 'ava'
import uiServer from '../../server/ui/ui-server'

const host = 'localhost'
const port = 4001
let nuxt = null
let fastify = null

test.before('Start Fastify and Nuxt servers', async (t) => {
  const server = await uiServer.up(port, host)
  nuxt = server.nuxt
  fastify = server.fastify
})

test('Route / exits and render HTML', async (t) => {
  const context = {}

  const {
    html
  } = await nuxt.renderRoute('/', context)
  t.true(html.includes('<span class="title">Roomler.Live</span>'), 'Renders Title')
  t.pass()
})

test.after('Close Fastify and Nuxt servers', (t) => {
  fastify.close()
  nuxt.close()
})
