const fastJson = require('fast-json-stringify')
const performanceService = require('../../services/performance/performance-service')
const messageService = require('../../services/message/message-service')
const config = require('../../../config')
const schema = require('./message-schema')
const stringify = fastJson(schema.wsMessage.valueOf())

class InviteController {
  async get (request, reply) {
    const result = await messageService.get(request.user.user._id, request.query.id)
    reply.send(result)
  }

  async getAll (request, reply) {
    const filter = {
      room: request.query.room,
      before: request.query.before && request.query.before !== 'undefined' ? request.query.before : undefined
    }
    const result = await messageService.getAll(request.user.user._id, request.query.page, request.query.size, filter)
    reply.send(result)
  }

  async create (request, reply) {
    const payload = request.body
    const result = await messageService.create(request.user.user._id, payload)
    reply.send(result)
  }

  async createWs (wss, conn, msg) {
    if (conn.user) {
      const payload = msg
      try {
        performanceService.performance.mark('MessageCreate start')
        const messages = await messageService.create(conn.user._id, payload)
        performanceService.performance.mark('MessageCreate end')
        performanceService.performance.measure('MessageCreate', 'MessageCreate start', 'MessageCreate end')
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            const clientMessages = messageService.route(messages, client.user._id)
            if (clientMessages.length) {
              client.send(stringify({
                op: config.wsSettings.opTypes.messageCreate,
                data: clientMessages
              }))
            }
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  async update (request, reply) {
    const payload = request.body
    const id = request.params.id
    const update = {
      $set: payload
    }
    const result = await messageService.update(request.user.user._id, id, update)
    reply.send(result)
  }

  async delete (request, reply) {
    const result = await messageService.delete(request.user.user._id, request.params.id)
    reply.send(result)
  }
}

module.exports = new InviteController()
