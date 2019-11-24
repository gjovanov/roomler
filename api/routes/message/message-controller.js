const { performance, PerformanceObserver } = require('perf_hooks')
const fastJson = require('fast-json-stringify')
const messageService = require('../../services/message/message-service')
const schema = require('./message-schema')
const stringify = fastJson(schema.wsMessage.valueOf())

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(`${item.name} ${item.duration}`)
  })
})
obs.observe({ entryTypes: ['measure'] })

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

  async createWs (wss, socket, msg) {
    if (socket.user) {
      const payload = msg
      try {
        performance.mark('Create start')
        const messages = await messageService.create(socket.user._id, payload)
        performance.mark('Create end')
        performance.measure('Create', 'Create start', 'Create end')
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            const clientMessages = []
            messages.forEach((message) => {
              message.is_read = message.readby.map(r => r._id.toString()).includes(client.user._id.toString())
              message.has_mention = message.mentions.map(r => r._id.toString()).includes(client.user._id.toString())
              if (message.room.owner._id.toString() === client.user._id.toString() ||
                  message.room.moderators.map(u => u._id.toString()).includes(client.user._id.toString()) ||
                  message.room.members.map(u => u._id.toString()).includes(client.user._id.toString())) {
                clientMessages.push(message)
              }
            })
            if (clientMessages.length) {
              client.send(stringify({
                type: 'message',
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
