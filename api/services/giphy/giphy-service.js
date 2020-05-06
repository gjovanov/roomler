const config = require('../../../config')
const getService = require('../../services/utils/get-service')

class GiphyService {
  async search (endpoint = 'gifs', query, offset = 0, limit = 30) {
    const url = `http://api.giphy.com/v1/${endpoint}/search?q=${query}&api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`
    console.log(url)
    const result = await getService.get({
      url,
      method: 'GET',
      json: true
    })
    return result
  }

  async trending (endpoint = 'gifs', offset = 0, limit = 30) {
    const result = await getService.get({
      url: `http://api.giphy.com/v1/${endpoint}/trending?api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`,
      method: 'GET',
      json: true
    })
    return result
  }

  async translate (endpoint = 'gifs', query, offset = 0, limit = 30) {
    const result = await getService.get({
      url: `http://api.giphy.com/v1/${endpoint}/translate?s=${query}&api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`,
      method: 'GET',
      json: true
    })
    return result
  }

  async random (endpoint = 'gifs', tag = undefined) {
    const result = await getService.get({
      url: `http://api.giphy.com/v1/${endpoint}/random?tag=&api_key=${config.giphySettings.apiKey}`,
      method: 'GET',
      json: true
    })
    return result
  }
}

module.exports = new GiphyService()
