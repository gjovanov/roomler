const config = require('roomler.config')
const getService = require('../utils/get-service')

class GiphyService {
  async search (endpoint = 'gifs', query, offset = 0, limit = 30) {
    const url = `https://api.giphy.com/v1/${endpoint}/search?q=${query}&api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`
    const result = await getService.get({
      url,
      method: 'GET',
      json: true
    })
    return result
  }

  async trending (endpoint = 'gifs', offset = 0, limit = 30) {
    const url = `https://api.giphy.com/v1/${endpoint}/trending?api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`
    const result = await getService.get({
      url,
      method: 'GET',
      json: true
    })
    return result
  }

  async translate (endpoint = 'gifs', query, offset = 0, limit = 30) {
    const url = `https://api.giphy.com/v1/${endpoint}/translate?s=${query}&api_key=${config.giphySettings.apiKey}&offset=${offset}&limit=${limit}`
    const result = await getService.get({
      url,
      method: 'GET',
      json: true
    })
    return result
  }

  async random (endpoint = 'gifs', tag = undefined) {
    const url = `https://api.giphy.com/v1/${endpoint}/random?tag=&api_key=${config.giphySettings.apiKey}`
    const result = await getService.get({
      url,
      method: 'GET',
      json: true
    })
    return result
  }
}

module.exports = new GiphyService()
