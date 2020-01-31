import {
  storage
} from '@/services/storage'

import {
  handleError,
  handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  peers: [],
  user: null,
  token: null,
  oauth: null,
  menu: {
    members: false
  }
})

export const mutations = {
  setPeers (state, peers) {
    state.peers = peers
  },
  push (state, peer) {
    // eslint-disable-next-line no-debugger
    debugger
    const found = state.peers.find(p => p._id === peer._id)
    if (!found) {
      state.peers.push(peer)
    }
  },
  pull (state, peerid) {
    state.peers = state.peers.filter(p => p._id !== peerid)
  },
  replace (state, updatedPeer) {
    state.peers = state.peers.map(p => p._id === updatedPeer._id ? updatedPeer : p)
  },

  pushUserConnection (state, userConnections) {
    userConnections.forEach((userConnection) => {
      const user = state.peers.find(u => u._id === userConnection.user)
      if (user) {
        const uconn = user.user_connections.find(uc => uc === userConnection._id)
        if (!uconn) {
          user.user_connections.push(userConnection._id)
        }
      }
    })
  },
  pullUserConnection (state, userConnections) {
    userConnections.forEach((userConnection) => {
      const user = state.peers.find(u => u._id === userConnection.user)
      if (user) {
        user.user_connections = user.user_connections.filter(uc => uc !== userConnection._id)
      }
    })
  },

  storeUserInfo (state, result) {
    // eslint-disable-next-line no-debugger
    debugger
    storage.set('token', result.token, true)
    state.user = result.user
    state.token = result.token
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
    storage.clear('token')
    state.user = null
    state.token = null
    state.oauth = null
  },

  toggleMenu (state, menu) {
    state.menu[menu] = !state.menu[menu]
  }
}

export const actions = {
  subscribe ({
    commit,
    state,
    rootState
  }) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      if (data.op === rootState.api.config.config.wsSettings.opTypes.userConnectionOpened) {
        commit('pushUserConnection', data.data)
      } else if (data.op === rootState.api.config.config.wsSettings.opTypes.userConnectionClosed) {
        commit('pullUserConnection', data.data)
      }
    })
  },
  async register ({
    commit
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/auth/register', payload)
      commit('storeUserInfo', response.result)
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
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  logout ({
    commit
  }, payload) {
    try {
      commit('api/room/setRooms', [], {
        root: true
      })
      commit('clearUserInfo')
    } catch (err) {
      handleError(err, commit)
    }
  },

  async me ({
    commit
  }) {
    const response = {}
    try {
      const token = storage.get('token')
      if (token) {
        commit('storeUserInfo', {
          token
        })
        response.result = await this.$axios.$get('/api/auth/me')
        commit('storeUserInfo', response.result)
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
  }, username) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/auth/get/${username}`)
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
    return state.peers.find(u => u._id === userid)
  },
  getUsers: state => (userids) => {
    return state.peers.filter(u => userids.includes(u._id))
  },
  isOnline: state => (userid) => {
    const user = state.peers.find(u => u._id === userid)
    return user && user.user_connections && user.user_connections.length
  }
}
