import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'
import * as moment from 'moment'

export const state = () => ({
  messages: {}
})

export const mutations = {
  initMessages (state, room) {
    if (!state.messages[room]) {
      const msgs = { }
      msgs[room] = []
      state.messages = { ...state.messages, ...msgs }
    }
  },

  pushAll (state, { room, messages }) {
    if (messages && messages.length) {
      if (!state.messages[room]) {
        const msgs = { }
        msgs[room] = []
        state.messages = { ...state.messages, ...msgs }
      }
      const result = [...state.messages[room]]
      messages.forEach((message) => {
        const existingMessage = result.find(m => (m._id === message._id) || (m.client_id === message.client_id))
        if (!existingMessage) {
          result.push(message)
        }
      })
      state.messages[room] = result
        .map((message) => {
          const updatedMessage = messages.find(m => (m._id === message._id) || (m.client_id === message.client_id))
          return updatedMessage || message
        })
        .sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt)
        })
    }
  },
  pull (state, { room, id }) {
    state.messages[room] = state.messages[room].filter(m => m._id !== id)
  },
  pullAll (state, { room, messages }) {
    const messageIds = messages.map(m => m._id)
    state.messages[room] = state.messages[room]
      .filter((m) => {
        return !messageIds.includes(m._id)
      })
  }
}

export const actions = {
  subscribe ({
    commit,
    state,
    rootState
  }, router) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      if (data.op === rootState.api.config.config.wsSettings.opTypes.messageCreate ||
          data.op === rootState.api.config.config.wsSettings.opTypes.messageReactionPush ||
          data.op === rootState.api.config.config.wsSettings.opTypes.messageReactionPull) {
        if (Array.isArray(data.data) && data.data.length) {
          commit('pushAll', { room: data.data[0].room.path, messages: data.data })
        } else {
          commit('pushAll', { room: data.data[0].room.path, messages: [data.data] })
        }
      }
    })
  },
  async create ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      const room = payload.room
      payload.room = room._id
      if (this.$wss.ws.readyState) {
        const message = {
          op: rootState.api.config.config.wsSettings.opTypes.messageCreate,
          payload
        }
        this.$wss.send(JSON.stringify(message))
      } else {
        response.result = await this.$axios.$post('/api/message/create', payload)
        commit('pushAll', { room: response.result.room.path, message: response.result })
      }
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async getAll ({
    commit,
    dispatch,
    state
  }, { room, before }) {
    const response = {}
    try {
      const roomPeers = [room.owner, ...room.members, room.moderators]
      response.result = await this.$axios.$get(`/api/message/get-all?room=${room._id}&before=${before}`)

      // if messages contain info about ex peers (removed from the room)
      // then download user info for those ex peers
      const messagePeers = [...new Set(
        response.result
          .map(message => [message.author, ...message.mentions, ...message.reactions.map(r => r.user)])
          .reduce((a, b) => [...a, ...b], []))]
      const exPeers = messagePeers.filter(p => !roomPeers.includes(p))
      await Promise.all(exPeers.map(p => dispatch('api/auth/get', p, { root: true })))
      commit('pushAll', { room: room.path, messages: response.result })
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
      commit('pushAll', { room: response.result.room.path, messages: [response.result] })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async delete ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$delete(`/api/room/delete/${payload.id}`)
      commit('pull', { room: payload.room, id: payload.id })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}

export const getters = {
  dailyMessages: state => (room) => {
    const dailyMessages = { }
    state.messages[room].forEach((message) => {
      const date = moment(message.createdAt)
      const dateKey = date.format('YYYY-MM-DD')
      if (!dailyMessages[dateKey]) {
        dailyMessages[dateKey] = []
      }
      dailyMessages[dateKey].push(message)
    })
    return dailyMessages
  },
  unreads: state => (room) => {
    const result = []
    if (state.messages[room]) {
      state.messages[room].forEach((message) => {
        if (!message.is_read) {
          result.push(message)
        }
      })
    }
    return result
  },

  mentions: state => (room, userid) => {
    const result = []
    if (state.messages[room]) {
      state.messages[room].forEach((message) => {
        if (!message.is_read && message.has_mention) {
          result.push(message)
        }
      })
    }
    return result
  },

  reactions: state => (message) => {
    const result = { }
    const reactions = message.reactions || []

    reactions.forEach((reaction) => {
      const grouping = result[reaction.name]
      if (!grouping) {
        result[reaction.name] = {
          symbol: reaction.symbol,
          list: [reaction]
        }
      } else {
        grouping.list.push(reaction)
      }
    })
    return result
  }
}
