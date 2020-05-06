const giphyService = require('../../services/giphy/giphy-service')

class GiphyController {
  async search (request, reply) {
    const result = await giphyService.search(
      request.params.endpoint,
      request.query.query,
      request.query.offset,
      request.query.limit
    )
    reply.send(result)
  }

  async trending (request, reply) {
    const result = await giphyService.trending(
      request.params.endpoint,
      request.query.offset,
      request.query.limit
    )
    reply.send(result)
  }

  async translate (request, reply) {
    const result = await giphyService.translate(
      request.params.endpoint,
      request.query.query,
      request.query.offset,
      request.query.limit
    )
    reply.send(result)
  }

  async random (request, reply) {
    const result = await giphyService.random(
      request.params.endpoint,
      request.query.tag !== 'undefined' &&
      request.query.tag !== 'null' &&
      request.query.tag !== '' ? request.query.tag
        : undefined)
    reply.send(result)
  }
}

module.exports = new GiphyController()
