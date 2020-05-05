import {
  handleError
} from '@/services/ajax-handlers'

export const state = () => ({
  searchResult: [],
  trendingResult: [],
  translateResult: [],
  randomResult: []
})

export const mutations = {
  setResult (state, { type, result }) {
    state[`${type}Result`] = result
  }
}

export const actions = {
  async search ({
    commit,
    state
  }, {
    query,
    offset = 0,
    limit = 10
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/giphy/search?query=${query}&offset=${offset}&limit=${limit}`)
      commit('setResult', { type: 'search', result: response.result })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async trending ({
    commit,
    state
  }, {
    offset = 0,
    limit = 10
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/giphy/trending?offset=${offset}&limit=${limit}`)
      commit('setResult', {
        type: 'trending',
        result: response.result
      })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async translate ({
    commit,
    state
  }, {
    query,
    offset = 0,
    limit = 10
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/giphy/translate?query=${query}&offset=${offset}&limit=${limit}`)
      commit('setResult', {
        type: 'translate',
        result: response.result
      })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async random ({
    commit,
    state
  }, {
    tag,
    offset = 0,
    limit = 10
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/giphy/random?tag=${tag}&offset=${offset}&limit=${limit}`)
      commit('setResult', {
        type: 'random',
        result: response.result
      })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
