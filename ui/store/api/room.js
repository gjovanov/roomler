import Tree from '../../services/tree'
import {
  handleError,
  handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  room: null,
  rooms: [],
  tree: {
    source: new Tree([]),
    open: [],
    model: []
  }
})

export const mutations = {
  setRoom (state, room) {
    state.room = room
  },
  setRooms (state, rooms) {
    state.rooms = rooms
    state.tree.source = new Tree(state.rooms)
  },
  push (state, room) {
    room.children = []
    state.rooms.push(room)
    state.tree.source = new Tree(state.rooms)
  },
  pull (state, roomid) {
    if (state.room && state.room._id === roomid) {
      state.room = null
    }
    state.rooms = state.rooms.filter(r => r._id !== roomid)
    state.tree.source = new Tree(state.rooms)
  },
  replace (state, updatedRoom) {
    if (state.room && state.room._id === updatedRoom._id) {
      state.room = updatedRoom
    }
    state.rooms = state.rooms.map(r => r._id === updatedRoom._id ? updatedRoom : r)
    state.tree.source = new Tree(state.rooms)
  },

  pushUser (state, invite) {
    const room = state.rooms.find(r => r._id === invite.room._id)
    if (room) {
      room[`${invite.type}s`].push(invite.invitee._id)
    }
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
      if (
        data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerRoleUpdate ||
        data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerAdd ||
        data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerJoin) {
        data.data.forEach((record) => {
          record.users.forEach((user) => {
            commit('api/auth/push', user, {
              root: true
            })
          })
          commit('api/room/replace', record.room, {
            root: true
          })
        })
      } else if (
        data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerRemove ||
        data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerLeave) {
        data.data.forEach(async (record) => {
          record.users.forEach((user) => {
            commit('api/auth/push', user, {
              root: true
            })
          })
          const userid = rootState.api.auth.user._id
          const isUserRemoved = record.room.owner !== userid && !record.room.members.includes(userid) && !record.room.moderators.includes(userid)
          if (isUserRemoved) {
            handleSuccess(`You have been removed from the room '${record.room.path}'`, commit)
            if (rootState.api.room.room && rootState.api.room.room._id === record.room._id) {
              await router.push({ path: '/' })
            }
            commit('api/room/pull', record.room._id, {
              root: true
            })
          } else {
            commit('api/room/replace', record.room, {
              root: true
            })
          }
        })
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
  getUserRole: state => (roomid, userid) => {
    const room = state.rooms.find(r => r._id === roomid)
    if (room) {
      if (room.owner === userid) {
        return 'owner'
      } else if (room.moderators.includes(userid)) {
        return 'moderator'
      } else if (room.members.includes(userid)) {
        return 'member'
      }
    }
    return null
  }
}
