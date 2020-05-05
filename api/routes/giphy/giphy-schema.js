const S = require('fluent-schema')

const searchQueryString = S.object()
  .prop('query', S.string().required())
  .prop('offset', S.integer())
  .prop('limit', S.integer())

const trendingQueryString = S.object()
  .prop('offset', S.integer())
  .prop('limit', S.integer())

const translateQueryString = S.object()
  .prop('query', S.string().required())
  .prop('offset', S.integer())
  .prop('limit', S.integer())

const randomQueryString = S.object()
  .prop('tag', S.string())

const original = S.object()
  .prop('url', S.string())
  .prop('mp4', S.string())
  .prop('webp', S.string())
  .prop('width', S.string())
  .prop('height', S.string())

const images = S.object()
  .prop('original', original)

const giphy = S.object()
  .prop('type', S.string())
  .prop('id', S.string())
  .prop('url', S.string())
  .prop('slug', S.string())
  .prop('bitly_gif_url', S.string())
  .prop('contentType', S.string())
  .prop('bitly_url', S.string())
  .prop('embed_url', S.string())
  .prop('username', S.string())
  .prop('source', S.string())
  .prop('title', S.string())
  .prop('rating', S.string())
  .prop('content_url', S.string())
  .prop('source_tld', S.string())
  .prop('source_post_url', S.string())
  .prop('is_sticker', S.boolean())
  .prop('import_datetime', S.string())
  .prop('trending_datetime', S.string())
  .prop('images', images)

const giphyList = S.array().items(giphy)

module.exports = {
  search: {
    querystring: searchQueryString,
    response: {
      200: giphyList
    }
  },
  trending: {
    querystring: trendingQueryString,
    response: {
      200: giphyList
    }
  },
  translate: {
    querystring: translateQueryString,
    response: {
      200: giphyList
    }
  },
  random: {
    querystring: randomQueryString,
    response: {
      200: giphyList
    }
  }
}
