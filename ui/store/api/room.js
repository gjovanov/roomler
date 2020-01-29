import Tree from '../../services/tree'
import {
  handleError
  // handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  users: [],
  rooms: [],
  tree: {
    source: new Tree([]),
    open: [],
    model: []
  }
})

const uniqueUsers = (room, users) => {
  let found = users.find(u => u._id === room.owner._id)
  if (!found) {
    users.push(room.owner)
  }
  room.moderators.forEach((user) => {
    found = users.find(u => u._id === user._id)
    if (!found) {
      users.push(user)
    }
  })
  room.members.forEach((user) => {
    found = users.find(u => u._id === user._id)
    if (!found) {
      users.push(user)
    }
  })
}

export const mutations = {
  setRooms (state, rooms) {
    state.rooms = rooms
    state.tree.source = new Tree(state.rooms)
    const users = []
    state.rooms.forEach((room) => {
      uniqueUsers(room, users)
    })
    state.users = users
  },
  push (state, room) {
    room.children = []
    state.rooms.push(room)
    state.tree.source = new Tree(state.rooms)
    const users = []
    state.rooms.forEach((room) => {
      uniqueUsers(room, users)
    })
    state.users = users
  },
  pull (state, roomid) {
    state.rooms = state.rooms.filter(r => r._id !== roomid)
    state.tree.source = new Tree(state.rooms)
    const users = []
    state.rooms.forEach((room) => {
      uniqueUsers(room, users)
    })
    state.users = users
  },
  replace (state, updatedRoom) {
    state.rooms = state.rooms.map(r => r._id === updatedRoom._id ? updatedRoom : r)
    state.tree.source = new Tree(state.rooms)
    const users = []
    state.rooms.forEach((room) => {
      uniqueUsers(room, users)
    })
    state.users = users
  },
  pushUserConnection (state, userConnections) {
    userConnections.forEach((userConnection) => {
      const user = state.users.find(u => u._id === userConnection.user)
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
      const user = state.users.find(u => u._id === userConnection.user)
      if (user) {
        user.user_connections = user.user_connections.filter(uc => uc !== userConnection._id)
      }
    })
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
  async create ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/room/create', payload)
      commit('push', response.result)
      commit('api/message/initMessages', response.result.path, {
        root: true
      })
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
      response.result = await this.$axios.$get(`/api/room/get?id=${id}`)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async getAll ({
    commit,
    state
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get('/api/room/get-all')
      commit('setRooms', response.result)
      response.result.forEach((room) => {
        commit('api/message/initMessages', room.path, {
          root: true
        })
      })
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
      response.result = await this.$axios.$put(`/api/room/update/${payload.id}`, payload.update)
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

export const getters = {
  tree: (state) => {
    return state.tree
  },
  roomPaths: (state) => {
    return state.rooms.map(r => r.path)
  },
  selectedRoom: state => (roomname) => {
    const nullo = { tags: [] }
    return roomname ? (state.rooms.find(r => r.name.toLowerCase() === roomname.toLowerCase()) || nullo) : nullo
  },
  getUser: state => (userid) => {
    return state.users.find(u => u._id === userid)
  },
  isOnline: state => (userid) => {
    const user = state.users.find(u => u._id === userid)
    return user && user.user_connections && user.user_connections.length
  }
}
