const fp = require('fastify-plugin')
const client = require('ari-client')

function fastifyAsteriskAri (fastify, options, next) {
  client.connect(
    options.url,
    options.username,
    options.password,
    (err, ari) => {
      if (err) {
        return next(err)
      }
      fastify
        .decorate('ari', ari)
        .addHook('onClose',
          (f, done) => {
            fastify.ari.stop()
            done()
          })
      ari.on('StasisStart',
        async (event, channel) => {
          try {
            fastify.log.info(`StatsisStart event: ${event}`)

            if (channel && event.channel.dialplan.exten !== 'h') {
              await channel.answer()

              // find or create a mixing bridge based on exten
              let bridges = await ari.bridges.list()
              let bridge = bridges.find((b) => {
                return b.id === event.channel.dialplan.exten && b.name === event.channel.dialplan.exten
              })
              if (!bridge) {
                try {
                  fastify.log.info('Bridge not found. Trying to create a new bridge...')
                  bridge = await ari.bridges.createWithId(
                    {
                      bridgeId: event.channel.dialplan.exten,
                      name: event.channel.dialplan.exten,
                      type: 'mixing'
                    }
                  )
                  fastify.log.info('New bridge was created successfully.')
                } catch (e) {
                  fastify.log.info('Bridge creation failed. Possible it was created concurrently. Trying to load the bridge...')
                  bridges = await ari.bridges.list()
                  bridge = bridges.find((b) => {
                    return b.id === event.channel.dialplan.exten && b.name === event.channel.dialplan.exten
                  })
                  if (bridge) {
                    fastify.log.info('Bridge was found.')
                  }
                }

                if (bridge) {
                  bridge.on('ChannelLeftBridge', async (event, instances) => {
                    fastify.log.info('Checking if we can destroy the bridge?')
                    const holdingBridge = instances.bridge
                    if (holdingBridge.channels.length === 0 && holdingBridge.id === bridge.id) {
                      fastify.log.info('Destroying bridge...')
                      await bridge.destroy()
                    }
                  })
                }
              } else {
                fastify.log.info('Existing bridge was found.')
              }

              if (bridge) {
                fastify.log.info(`Adding channel: ${channel.id} ...`)
                bridge.addChannel({ channel: channel.id })
                fastify.log.info('Channel added.')
              } else {
                fastify.log.error('Unexpected error: Bridge was neither found nor created.')
              }
            }
          } catch (e) {
            fastify.log.error(e)
          }
        })
      ari.start(options.application)

      const generateAsteriskAccounts = async () => {
        const userService = require('../../services/user/user-service')
        const users = await userService.getAll({})
        fastify.log.info(`Generating Asterisk accounts for ${users.length} Roomler DB accounts`)
        users.forEach(async (user) => {
          try {
            const aor = {
              configClass: 'res_pjsip',
              objectType: 'aor',
              id: user._id,
              fields: [
                { attribute: 'max_contacts', value: '1' },
                { attribute: 'remove_existing', value: 'yes' }
              ]
            }
            await ari.asterisk.updateObject(aor)

            const auth = {
              configClass: 'res_pjsip',
              objectType: 'auth',
              id: user._id,
              fields: [
                { attribute: 'auth_type', value: 'userpass' },
                { attribute: 'username', value: `${user._id}` },
                { attribute: 'password', value: `${user.createdAt.getTime()}` }
              ]
            }
            await ari.asterisk.updateObject(auth)

            const endpoint = {
              configClass: 'res_pjsip',
              objectType: 'endpoint',
              id: user._id,
              fields: [
                { attribute: 'aors', value: `${user._id}` },
                { attribute: 'auth', value: `${user._id}` },
                { attribute: 'context', value: 'roomler-main' },
                { attribute: 'direct_media', value: 'no' },
                { attribute: 'rtp_symmetric', value: 'yes' },
                { attribute: 'force_rport', value: 'yes' },
                { attribute: 'rtp_timeout', value: '30' },
                { attribute: 'device_state_busy_at', value: '1' },
                { attribute: 'call_group', value: '1' },
                { attribute: 'pickup_group', value: '1' },
                { attribute: 'moh_suggest', value: 'default' },
                { attribute: 'disallow', value: 'all' },
                { attribute: 'allow', value: 'opus' },
                { attribute: 'allow', value: 'alaw' },
                { attribute: 'allow', value: 'ulaw' },
                { attribute: 'allow', value: 'vp8' },
                { attribute: 'rewrite_contact', value: 'yes' }
              ]
            }
            await ari.asterisk.updateObject(endpoint)
          } catch (e) {
            fastify.log.error(e)
          }
        })
      }
      if (options.generateAccounts) {
        generateAsteriskAccounts()
      }

      next()
    })
}

module.exports = fp(fastifyAsteriskAri, {
  fastify: '>=2.6.0',
  decorators: ['mongo'],
  dependencies: ['fastify-mongoose']
})
