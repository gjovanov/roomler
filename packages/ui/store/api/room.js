import {
  handleError
} from '@/services/ajax-handlers'
import { treeOps } from '../../services/tree-ops'
import Tree from '../../services/tree'
import { handleRoomCreate } from './room/handlers/room-create'
import { handleRoomUpdate } from './room/handlers/room-update'
import { handleRoomDelete } from './room/handlers/room-delete'
import { handlePeerPush } from './room/handlers/peer-push'
import { handlePeerPull } from './room/handlers/peer-pull'

export const state = () => ({
  room: null,
  rooms: [],
  tree: new Tree([])
})

export const mutations = {
  setRoom (state, room) {
    state.room = room
    if (!state.rooms.length && room && room._id) {
      state.rooms = [room]
    }
  },
  setRooms (state, rooms) {
    rooms.filter(r => !!r).forEach((room) => { room.children = [] })
    state.rooms = rooms
    const open = state.tree.open
    state.tree = new Tree(state.rooms)
    state.tree.open = open
  },
  push (state, room) {
    room.children = []
    if (state.room && state.room._id === room._id) {
      state.room = room
    }
    const found = state.rooms.find(r => r._id === room._id)
    if (!found) {
      state.rooms = [room, ...state.rooms].sort((a, b) => a.path.localeCompare(b.path))
    } else {
      state.rooms = state.rooms
        .map(r => r._id === room._id ? room : r)
        .sort((a, b) => a.path.localeCompare(b.path))
    }
    const open = state.tree.open
    state.tree = new Tree(state.rooms)
    state.tree.open = open
  },
  pull (state, roomid) {
    if (state.room && state.room._id === roomid) {
      state.room = null
    }
    state.rooms = state.rooms.filter(r => r._id !== roomid)
    const open = state.tree.open
    state.tree = new Tree(state.rooms)
    state.tree.open = open
  },
  pullAll (state, ids) {
    if (state.room && ids.includes(state.room._id)) {
      state.room = null
    }
    state.rooms = state.rooms.filter(r => !ids.includes(r._id))
    const open = state.tree.open
    state.tree = new Tree(state.rooms)
    state.tree.open = open
  },
  setOpen (state, list) {
    state.tree.open = list
  },
  open (state, room) {
    state.tree.open.push(room.path)
    const parent = treeOps.findParent(state.tree.items, room)
    if (parent) {
      state.tree.open.push(parent.path)
    }
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
    dispatch,
    commit,
    state,
    rootState
  }, { router, localePath }) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      handleRoomCreate(dispatch, commit, state, rootState, router, localePath, data)
      handleRoomUpdate(dispatch, commit, state, rootState, router, localePath, data)
      handleRoomDelete(dispatch, commit, state, rootState, router, localePath, data)

      handlePeerPush(dispatch, commit, state, rootState, router, localePath, data)
      handlePeerPull(dispatch, commit, state, rootState, router, localePath, data)
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
      commit('open', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },
  async get ({
    commit,
    state
  }, query) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/room/get?query=${query}`)
      commit('setRoom', response.result)
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
  }) {
    const response = {}
    try {
      response.result = await this.$axios.$get('/api/room/get-all')
      const peers = response.result && response.result.peers ? response.result.peers : []
      const rooms = response.result && response.result.rooms ? response.result.rooms : []
      const messages = response.result && response.result.messages ? response.result.messages : []
      const calls = response.result && response.result.calls ? response.result.calls : []
      commit('api/auth/setPeers', peers, { root: true })
      commit('setRooms', rooms)
      commit('setOpen', rooms.map(room => room._id))

      // if messages contain info about ex peers (removed from the room)
      // then download user info for those ex peers
      const roomPeers = [...new Set(rootState.api.auth.peers.map(p => p._id))]
      const messagePeers = [...new Set(
        messages
          .map(m => m.messages)
          .reduce((a, b) => [...a, ...b], [])
          .map(message => [message.author, ...message.mentions, ...message.reactions.map(r => r.user)])
          .reduce((a, b) => [...a, ...b], []))]

      const exPeers = messagePeers.filter(p => !roomPeers.includes(p))
      if (exPeers.length) {
        await dispatch('api/auth/getAll', exPeers, { root: true })
      }

      messages.forEach(m => commit('api/message/pushAll', m, { root: true }))
      commit('api/room/calls/setCalls', calls, { root: true })
    } catch (err) {
      // handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async explore ({
    commit,
    state
  }, payload = { search: '', page: 0, size: 10 }) {
    const response = {}
    try {
      response.result = await this.$axios.$get(`/api/room/explore?search=${payload.search}&page=${payload.page}&size=${payload.size}`)
    } catch (err) {
      // handleError(err, commit)
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
      const room = response.result.room
      const children = response.result.children
      const all = [room, ...children]
      all.forEach((r) => {
        commit('push', r)
        commit('open', r)
        if (state.room && state.room._id === r._id) {
          state.room = r
        }
      })
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
      const ids = [response.result.room._id, ...response.result.children.map(r => r._id)]
      commit('pullAll', ids)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  }
}

export const getters = {
  getRoom: state => (id) => {
    return state.rooms.find(r => r._id === id || r.path === id || r.name === id)
  },
  roomPaths: (state) => {
    return state.rooms.map(r => r.path)
  },
  selectedRoom: state => (room) => {
    return room ? state.rooms.find(r => r && room && ((r.name && r.name.toLowerCase() === room.toLowerCase()) || (r.path && r.path.toLowerCase() === room.toLowerCase()) || r._id === room)) : null
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
  },
  isRoomPeer: (state, getters, rootState) => (room, userid = null) => {
    const user = userid || (rootState.api.auth.user ? rootState.api.auth.user._id : null)
    return room && room._id ? [room.owner, ...room.members, ...room.moderators].includes(user) : false
  },
  getParent: state => (room) => {
    return treeOps.findParent(state.rooms, room)
  },
  getRoomsWithCalls: (state) => {
    return state.rooms.filter(r => r.calls && r.calls.length)
  }
}
