import {
  handleError
} from '@/services/ajax-handlers'

export const state = () => ({
  search: {
    data: [],
    pagination: {
      total_count: 0,
      count: 0,
      offset: 0
    }
  },
  trending: {
    data: [],
    pagination: {
      total_count: 0,
      count: 0,
      offset: 0
    }
  },
  translate: {
    data: [],
    pagination: {
      total_count: 0,
      count: 0,
      offset: 0
    }
  },
  random: {
    data: [],
    pagination: {
      total_count: 0,
      count: 0,
      offset: 0
    }
  }
})

export const mutations = {
  setResult (state, { type, data, pagination }) {
    state[type].data = data
    state[type].pagination = pagination
  }
}

export const actions = {
  async search ({
    commit,
    state
  }, {
    endpoint,
    query,
    offset = 0,
    limit = 15
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/giphy/${endpoint}/search?query=${query}&offset=${offset}&limit=${limit}`)
      commit('setResult', {
        type: 'search',
        data: response.result.data,
        pagination: response.result.pagination
      })
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
    endpoint,
    offset = 0,
    limit = 9
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/giphy/${endpoint}/trending?offset=${offset}&limit=${limit}`)
      commit('setResult', {
        type: 'trending',
        data: response.result.data,
        pagination: response.result.pagination
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
    endpoint,
    query,
    offset = 0,
    limit = 9
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/giphy/${endpoint}/translate?query=${query}&offset=${offset}&limit=${limit}`)
      commit('setResult', {
        type: 'translate',
        data: response.result.data,
        pagination: response.result.pagination
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
    endpoint,
    tag,
    offset = 0,
    limit = 9
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/giphy/${endpoint}/random?tag=${tag}&offset=${offset}&limit=${limit}`)
      commit('setResult', {
        type: 'random',
        data: response.result.data,
        pagination: response.result.pagination
      })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
