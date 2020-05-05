const config = require('../../../config')
const getService = require('../../services/utils/get-service')

class GiphyService {
  async search (query, offset = 0, limit = 10) {
    const result = await getService.get({
      url: `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`,
      method: 'GET',
      json: true
    })
    return result.data
  }

  async trending (offset = 0, limit = 10) {
    const result = await getService.get({
      url: `http://api.giphy.com/v1/gifs/trending?api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`,
      method: 'GET',
      json: true
    })
    return result.data
  }

  async translate (query, offset = 0, limit = 10) {
    const result = await getService.get({
      url: `http://api.giphy.com/v1/gifs/translate?s=${query}&api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`,
      method: 'GET',
      json: true
    })
    console.log(result.data)
    return result.data
  }

  async random (tag = undefined) {
    const result = await getService.get({
      url: `http://api.giphy.com/v1/gifs/random?tag=&api_key=${config.giphySettings.apiKey}`,
      method: 'GET',
      json: true
    })
    console.log(result.data)
    return result.data
  }
}

module.exports = new GiphyService()
