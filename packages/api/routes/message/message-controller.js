const performanceService = require('../../services/performance/performance-service')
const messageService = require('../../services/message/message-service')
const config = require('roomler.config')
const wsDispatcher = require('../ws/ws-dispatcher')

class MessageController {
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
    wsDispatcher.publish(config.wsSettings.opTypes.messageCreate, result)
    reply.send(result)
  }

  async createWs (fastify, wss, conn, req, msg) {
    if (conn.user) {
      const payload = msg
      try {
        performanceService.performance.mark('MessageCreate start')
        const messages = await messageService.create(conn.user._id, payload)
        wsDispatcher.publish(config.wsSettings.opTypes.messageCreate, messages)
        performanceService.performance.mark('MessageCreate end')
        performanceService.performance.measure('MessageCreate', 'MessageCreate start', 'MessageCreate end')
        return messages
      } catch (err) {
        fastify.log.error(err)
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
    wsDispatcher.publish(config.wsSettings.opTypes.messageUpdate, [result])
    reply.send(result)
  }

  async updateWs (fastify, wss, conn, req, msg) {
    if (conn.user) {
      try {
        performanceService.performance.mark('MessageUpdate start')
        const result = await messageService.update(conn.user._id, msg.id, msg.update)
        wsDispatcher.publish(config.wsSettings.opTypes.messageUpdate, [result])
        performanceService.performance.mark('MessageUpdate end')
        performanceService.performance.measure('MessageUpdate', 'MessageUpdate start', 'MessageUpdate end')
        return result
      } catch (err) {
        fastify.log.error(err)
      }
    }
  }

  async delete (request, reply) {
    const room = await messageService.get(request.user.user._id, request.params.id)
    const result = await messageService.delete(request.user.user._id, request.params.id)
    wsDispatcher.publish(config.wsSettings.opTypes.messageDelete, [room])
    reply.send(result)
  }
}

module.exports = new MessageController()
