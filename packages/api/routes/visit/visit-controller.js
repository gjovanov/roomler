const performanceService = require('../../services/performance/performance-service')
const config = require('roomler.config')
const visitService = require('../../services/visit/visit-service')
const wsDispatcher = require('../ws/ws-dispatcher')

class VisitController {
  async getStats (request, reply) {
    const result = await visitService.getStats({
      from: request.query.from,
      to: request.query.to,
      type: request.query.type,
      status: request.query.status,
      room: request.query.room,
      url: request.query.url,
      referrer: request.query.referrer,
      user: request.query.user,
      os: request.query.os,
      browser: request.query.browser,
      country: request.query.country,
      device: request.query.device,
      page: request.query.page || 0,
      size: request.query.size || 100
    })
    reply.send(result)
  }

  async openVisitWs (fastify, wss, conn, req, data) {
    const id = conn.connection_id
    if (id) {
      try {
        // first close open visit, then open new one
        await this.closeVisitWs(fastify, wss, conn, req)

        performanceService.performance.mark('VisitOpen start')
        const opened = await visitService.open(id, data)
        performanceService.performance.mark('VisitOpen end')
        performanceService.performance.measure('VisitOpen', 'VisitOpen start', 'VisitOpen end')

        wsDispatcher.publish(config.wsSettings.opTypes.visitOpen, [opened], true)
      } catch (err) {
        fastify.log.error(err)
      }
    }
  }

  async closeVisitWs (fastify, wss, conn, req) {
    const id = conn.connection_id
    if (id) {
      try {
        performanceService.performance.mark('VisitClose start')
        await visitService.close(id)
        performanceService.performance.mark('VisitClose end')
        performanceService.performance.measure('VisitClose', 'VisitClose start', 'VisitClose end')
      } catch (err) {
        fastify.log.error(err)
      }
    }
  }
}

module.exports = new VisitController()
