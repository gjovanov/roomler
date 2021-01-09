import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'
import moment from 'moment/moment'
import 'moment/locale/en-gb'
import { handleMessageCreate } from './message/handlers/message-create'
import { handleMessageUpdate } from './message/handlers/message-update'
import { handleReactionPush } from './message/handlers/reaction-push'
import { handleReactionPull } from './message/handlers/reaction-pull'

export const state = () => ({
  messages: {}
})

export const mutations = {
  toggleEdit (state, message) {
    message.edit = !message.edit
  },
  pushAll (state, { roomid, messages }) {
    if (messages && messages.length) {
      if (!state.messages[roomid]) {
        const msgs = { }
        msgs[roomid] = []
        state.messages = { ...state.messages, ...msgs }
      }
      const result = [...state.messages[roomid]]
      messages.forEach((message) => {
        if (message.edit === undefined) {
          message.edit = false
        }
        const existingMessage = result.find(m => (m._id === message._id) || (m.client_id === message.client_id))
        if (!existingMessage) {
          result.push(message)
        }
      })
      state.messages[roomid] = result
        .map((message) => {
          const updatedMessage = messages.find(m => (m._id === message._id) || (m.client_id === message.client_id))
          return updatedMessage || message
        })
        .sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt)
        })
    }
  },
  pull (state, { roomid, id }) {
    state.messages[roomid] = state.messages[roomid].filter(m => m._id !== id)
  },
  pullAll (state, { roomid, messages }) {
    const messageIds = messages.map(m => m._id)
    state.messages[roomid] = state.messages[roomid]
      .filter((m) => {
        return !messageIds.includes(m._id)
      })
  }
}

export const actions = {
  subscribe ({
    dispatch,
    commit,
    state,
    rootState
  }, { router, localePath }) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      handleMessageCreate(dispatch, commit, state, rootState, router, localePath, data)
      handleMessageUpdate(dispatch, commit, state, rootState, router, localePath, data)
      handleReactionPush(dispatch, commit, state, rootState, router, localePath, data)
      handleReactionPull(dispatch, commit, state, rootState, router, localePath, data)
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
        commit('pushAll', { roomid: response.result.room._id, message: response.result })
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
    rootState
  }, { room, before, page = 0, size = 25 }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/message/get-all?room=${room._id}&page=${page}&size=${size}&before=${before}`)

      // if messages contain info about ex peers (removed from the room)
      // then download user info for those ex peers
      const roomPeers = [...new Set(rootState.api.auth.peers.map(p => p._id))]
      const messagePeers = [...new Set(
        response.result
          .map(message => [message.author, ...message.mentions, ...message.reactions.map(r => r.user)])
          .reduce((a, b) => [...a, ...b], []))]
      const exPeers = messagePeers.filter(p => !roomPeers.includes(p))
      if (exPeers.length) {
        await dispatch('api/auth/getAll', exPeers, { root: true })
      }
      commit('pushAll', { roomid: room._id, messages: response.result })
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async update ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        const message = {
          op: rootState.api.config.config.wsSettings.opTypes.messageUpdate,
          payload
        }
        this.$wss.send(JSON.stringify(message))
      } else {
        response.result = await this.$axios.$put(`/api/message/update/${payload.id}`, payload.update)
        commit('pushAll', { roomid: response.result.room._id, message: response.result })
      }
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
  dailyMessages: state => (roomid) => {
    const dailyMessages = { }
    if (state.messages[roomid]) {
      state.messages[roomid].forEach((message) => {
        const date = moment(message.createdAt)
        const dateKey = date.format('YYYY-MM-DD')
        if (!dailyMessages[dateKey]) {
          dailyMessages[dateKey] = []
        }
        dailyMessages[dateKey].push(message)
      })
    }

    return dailyMessages
  },
  unreads: state => (roomid) => {
    const result = []
    if (state.messages[roomid]) {
      state.messages[roomid].forEach((message) => {
        if (!message.is_read) {
          result.push(message)
        }
      })
    }
    return result
  },

  mentions: state => (roomid, userid) => {
    const result = []
    if (state.messages[roomid]) {
      state.messages[roomid].forEach((message) => {
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
