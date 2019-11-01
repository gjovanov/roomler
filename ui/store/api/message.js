import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  messages: {}
})

const initMessages = (state, room) => {
  if (state.messages[room]) {
    state.messages[room] = []
  }
}

export const mutations = {
  setMessages (state, room, messages) {
    initMessages(state, room)
    state.messages[room] = messages
  },
  push (state, room, message) {
    if (room) {
      initMessages(state, room)
      state.messages[room].push(message)
    }
  },
  pull (state, room, message) {
    state.messages[room] = state.messages[room].filter(m => m._id !== message._id)
  },
  replace (state, room, updatedMessage) {
    state.messages[room] = state.messages[room].map(m => m._id === updatedMessage._id ? updatedMessage : m)
  }
}

export const actions = {
  subscribe ({
    commit,
    state
  }) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      console.log(data)
      if (data.type === 'message') {
        if (Array.isArray(data.data)) {
          data.data.forEach((msg) => {
            commit('push', msg.room.path, msg)
          })
        } else {
          commit('push', data.data.room.path, data)
        }
      }
    })
  },
  async create ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        this.$wss.send(JSON.stringify(payload))
      } else {
        response.result = await this.$axios.$post('/api/message/create', payload)
        commit('push', response.result.room.path, response.result)
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },
  async get ({
    commit,
    state
  }, id) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/message/get?id=${id}`)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async getAll ({
    commit,
    state
  }, roomid) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/message/get-all?room=${roomid}`)
      commit('setRooms', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async update ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put(`/api/message/update/${payload.id}`, payload.update)
      commit('replace', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async delete ({
    commit,
    state
  }, id) {
    const response = {}
    try {
      response.result = await this.$axios.$delete(`/api/room/delete/${id}`)
      commit('pull', id)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}
