const errorSchema = require('../.common/error-schema')
const giphyController = require('./giphy-controller')
const giphySchema = require('./giphy-schema')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/giphy/:endpoint/search',
  schema: {
    params: giphySchema.search.params,
    querystring: giphySchema.search.querystring,
    response: {
      200: giphySchema.search.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: giphyController.search
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/giphy/:endpoint/trending',
  schema: {
    params: giphySchema.trending.params,
    querystring: giphySchema.trending.querystring,
    response: {
      200: giphySchema.trending.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: giphyController.trending
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/giphy/:endpoint/translate',
  schema: {
    params: giphySchema.translate.params,
    querystring: giphySchema.translate.querystring,
    response: {
      200: giphySchema.translate.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: giphyController.translate
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/giphy/:endpoint/random',
  schema: {
    params: giphySchema.random.params,
    querystring: giphySchema.random.querystring,
    response: {
      200: giphySchema.random.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: giphyController.random
}
]
