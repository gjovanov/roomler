const performanceService = require('../../services/performance/performance-service')
const messageService = require('../../services/message/message-service')
// const config = require('../../../config')
// const wsDispatcher = require('../ws/ws-dispatcher')

class MessageReactionsController {
  async push (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await messageService.pushReaction(request.user.user._id, id, payload)
    // wsDispatcher.dispatch(config.wsSettings.opTypes.messageReactionPush, [result], true)
    reply.send(result)
  }

  async pushWs (wss, conn, msg) {
    if (conn.user) {
      const payload = msg
      try {
        performanceService.performance.mark('ReactionPush start')
        await messageService.pullReaction(conn.user._id, payload.id)
        const message = await messageService.pushReaction(conn.user._id, payload.id, payload.data)
        performanceService.performance.mark('ReactionPush end')
        performanceService.performance.measure('ReactionPush', 'ReactionPush start', 'ReactionPush end')
        return message
      } catch (err) {
        console.log(err)
      }
    }
  }

  async pull (request, reply) {
    const id = request.params.id
    const result = await messageService.pullReaction(request.user.user._id, id)
    // wsDispatcher.dispatch(config.wsSettings.opTypes.messageReactionPull, [result], true)
    reply.send(result)
  }

  async pullWs (wss, conn, msg) {
    if (conn.user) {
      const payload = msg
      try {
        performanceService.performance.mark('ReactionPull start')
        const message = await messageService.pullReaction(conn.user._id, payload.id)
        performanceService.performance.mark('ReactionPull end')
        performanceService.performance.measure('ReactionPull', 'ReactionPull start', 'ReactionPull end')
        return message
      } catch (err) {
        console.log(err)
      }
    }
  }
}

module.exports = new MessageReactionsController()
