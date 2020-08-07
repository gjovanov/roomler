import {
  handleError,
  handleSuccess
} from '@/services/ajax-handlers'
import cookies from 'js-cookie'
import { handleConnectionPush } from './auth/handlers/connection-push'
import { handleConnectionPull } from './auth/handlers/connection-pull'

export const state = () => ({
  peers: [],
  user: null,
  token: null,
  oauth: null,
  isAdmin: false
})

export const mutations = {
  setPeers (state, peers) {
    if (state.user) {
      const found = peers.find(p => p._id === state.user._id)
      if (!found) {
        peers.push(state.user)
      }
    }
    state.peers = peers
  },
  push (state, peer) {
    const found = state.peers.find(p => p._id === peer._id)
    if (!found) {
      state.peers.push(peer)
    } else {
      state.peers = state.peers.map(p => p._id === peer._id ? peer : p)
    }
  },
  pull (state, peerid) {
    state.peers = state.peers.filter(p => p._id !== peerid)
  },
  replace (state, updatedPeer) {
    state.peers = state.peers.map(p => p._id === updatedPeer._id ? updatedPeer : p)
  },

  pushConnection (state, connections) {
    connections.forEach((connection) => {
      const user = state.peers.find(u => u._id === connection.user)
      if (user) {
        const uconn = user.connections.find(uc => uc === connection._id)
        if (!uconn) {
          user.connections.push(connection._id)
        }
      } else {
        this.$consola.info(`user ${connection.user} not found in ${JSON.stringify(state.peers)}`)
      }
    })
  },
  pullConnection (state, connections) {
    connections.forEach((connection) => {
      const user = state.peers.find(u => u._id === connection.user)
      if (user) {
        user.connections = user.connections.filter(uc => uc !== connection._id)
      } else {
        this.$consola.info(`user ${connection.user} not found in ${JSON.stringify(state.peers)}`)
      }
    })
  },

  storeUserInfo (state, result) {
    cookies.set('token', result.token, { expires: 14 })
    state.user = result.user
    state.token = result.token
    state.isAdmin = result.is_admin
    if (state.user && state.user._id) {
      const peer = state.peers.find(p => p._id === state.user._id)
      if (!peer) {
        state.peers.push(state.user)
      }
    }

    if (result.oauth) {
      state.oauth = result.oauth
    }
  },

  clearUserInfo (state) {
    cookies.remove('token')
    state.user = null
    state.token = null
    state.oauth = null
  }
}

export const actions = {
  subscribe ({
    dispatch,
    commit,
    state,
    rootState
  }, router) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      handleConnectionPush(dispatch, commit, state, rootState, router, data)
      handleConnectionPull(dispatch, commit, state, rootState, router, data)
    })
  },

  connectionUpdate ({
    commit,
    state,
    rootState
  }, payload) {
    const response = {}
    try {
      if (this.$wss.ws.readyState) {
        const message = {
          op: rootState.api.config.config.wsSettings.opTypes.connectionUpdate,
          payload
        }
        this.$wss.send(JSON.stringify(message))
      }
    } catch (err) {
      response.hasError = true
    }
    return response
  },

  async register ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/register', payload)
      commit('storeUserInfo', response.result)
      commit('replace', response.result.user)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async activate ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/activate', payload)
      commit('storeUserInfo', response.result)
      commit('replace', response.result.user)
      handleSuccess('Account was successfully activated', commit)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async reset ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/reset', payload)
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async updateUsername ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put('/api/auth/update/username', payload)
      commit('storeUserInfo', response.result)
      commit('replace', response.result.user)
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async updatePassword ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put('/api/auth/update/password', payload)
      commit('storeUserInfo', response.result)
      commit('replace', response.result.user)
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async login ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/login', payload)
      commit('storeUserInfo', response.result)
      commit('replace', response.result.user)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async logout ({
    dispatch,
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/logout')
      commit('api/room/setRooms', [], {
        root: true
      })
      commit('api/room/setRoom', null, {
        root: true
      })
      commit('clearUserInfo')
    } catch (err) {
      handleError(err, commit)
    }
  },

  async me ({
    commit,
    state
  }) {
    const response = {}
    try {
      const token = state.token
      if (token) {
        response.result = await this.$axios.$get('/api/auth/me')
        commit('storeUserInfo', response.result)
        commit('replace', response.result.user)
      }
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async getPeers ({
    commit,
    state
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get('/api/auth/get-peers')
      commit('setPeers', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async get ({
    commit
  }, query) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/auth/get/${query}`)
      commit('push', response.result)
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async getAll ({
    commit
  }, ids) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/getAll', { ids })
      response.result.forEach((u) => {
        commit('push', u)
      })
    } catch (err) {
      handleError(err, commit)
    }
    return response
  }
}

export const getters = {
  isAuthenticated: (state) => {
    return state.token && state.user && state.user.username
  },
  isActivated: (state) => {
    return state.token && state.user && state.user.username && state.user.is_active
  },
  avatarUrl: (state) => {
    return state.oauth ? state.oauth.avatar_url : (state.user ? state.user.avatar_url : null)
  },
  getUser: state => (userid) => {
    return state.peers.find(u => u._id === userid) || { username: 'N/A', avatar_url: null }
  },
  getUsers: state => (userids) => {
    return state.peers.filter(u => userids.includes(u._id))
  },
  isOnline: state => (userid) => {
    const user = state.peers.find(u => u._id === userid)
    return user && ((state.user && state.user._id === user._id) || (user.connections && user.connections.length))
  },
  getPeers: (state, getters, rootState) => {
    const rooms = rootState.api.room.rooms.filter(r => r && r._id)
    const userids = rooms ? [...new Set(rooms.map(r => [r.owner, ...r.members, ...r.moderators]).reduce((a, b) => a.concat(b), []))] : []
    const result = state.peers.filter(u => userids.includes(u._id))
    return result
  },
  getRoomPeers: (state, getters, rootState) => (room) => {
    const userids = room && room._id ? [room.owner, ...room.moderators, ...room.members] : []
    const result = state.peers.filter(u => userids.includes(u._id))
    return result
  }
}
