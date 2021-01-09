import {
  handleError
} from '@/services/ajax-handlers'
import cookies from 'js-cookie'
import { handleInviteAccept } from './invite/handlers/invite-accept'
import { handleInviteUpdate } from './invite/handlers/invite-update'
import { handleInviteDelete } from './invite/handlers/invite-delete'

export const state = () => ({
  invites: [],
  pendingInvites: [],
  pendingJoins: []
})

export const mutations = {
  storePendingInvites (state, invite) {
    const result = []
    if (invite) {
      result.push(invite)
    }

    // Merge with Cookie Pending Invites
    let invites = cookies.get('pendingInvites')
    if (invites && invites.trim()) {
      invites = JSON.parse(invites.trim())
      invites.forEach((i) => {
        if (!result.includes(i)) {
          result.push(i)
        }
      })
    }
    // Merge with State Pending Invites
    state.pendingInvites.forEach((i) => {
      if (!result.includes(i)) {
        result.push(i)
      }
    })
    state.pendingInvites = result
    cookies.set('pendingInvites', JSON.stringify(state.pendingInvites))
  },
  storePendingJoins (state, join) {
    const result = []
    if (join) {
      result.push(join)
    }

    // Merge with Cookie Pending Invites
    let joins = cookies.get('pendingJoins')
    if (joins && joins.trim()) {
      joins = JSON.parse(joins.trim())
      joins.forEach((i) => {
        if (!result.includes(i)) {
          result.push(i)
        }
      })
    }
    // Merge with State Pending Joins
    state.pendingJoins.forEach((i) => {
      if (!result.includes(i)) {
        result.push(i)
      }
    })
    state.pendingJoins = result
    cookies.set('pendingJoins', JSON.stringify(state.pendingJoins))
  },
  clearPendingInvites (state) {
    state.pendingInvites = []
    cookies.set('pendingInvites', state.pendingInvites)
  },
  clearPendingJoins (state) {
    state.pendingJoins = []
    cookies.set('pendingJoins', state.pendingJoins)
  },

  setInvites (state, invites) {
    state.invites = invites
  },
  push (state, invites) {
    invites.forEach((invite) => {
      state.invites.push(invite)
    })
  },
  pull (state, invite) {
    state.invites = state.invites.filter(r => r._id !== invite._id)
  },
  replace (state, updatedInvite) {
    state.invites = state.invites.map(r => r._id === updatedInvite._id ? updatedInvite : r)
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
      handleInviteAccept(dispatch, commit, state, rootState, router, localePath, data)
      handleInviteUpdate(dispatch, commit, state, rootState, router, localePath, data)
      handleInviteDelete(dispatch, commit, state, rootState, router, localePath, data)
    })
  },
  async create ({
    commit,
    state
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$post('/api/invite/create', payload)
      commit('push', response.result)
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
      response.result = await this.$axios.$put(`/api/invite/update/${payload.id}`, payload)
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
  }, payload) {
    const response = {}
    try {
      response.result = await this.$axios.$put(`/api/invite/delete/${payload._id}`)
      commit('pull', payload)
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
      response.result = await this.$axios.$get(`/api/invite/get?id=${id}`)
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
      response.result = await this.$axios.$get(`/api/invite/get-all?room=${roomid}`)
      commit('setInvites', response.result)
    } catch (err) {
      handleError(err, commit)
      response.hasError = true
    }
    return response
  },

  async acceptPendingInvites ({
    commit,
    state
  }) {
    const self = this
    const response = {}
    try {
      commit('storePendingInvites') // Merge Cookie with Store
      if (state.pendingInvites.length) {
        await Promise.all(state.pendingInvites.map(invite => self.$axios.$put(`/api/invite/accept/${invite}`).catch(() => {
          commit('clearPendingInvites')
        })))
        commit('clearPendingInvites')
      }
    } catch (err) {
      handleError(err, commit)
    }
    return response
  },

  async acceptPendingJoins ({
    commit,
    dispatch,
    state
  }, userid) {
    const response = {}
    try {
      commit('storePendingJoins') // Merge Cookie with Store
      // roomid|type => type=[member,moderator]
      // parts[0]=roomid
      // parts[1]=type
      if (state.pendingJoins.length) {
        await Promise.all(state.pendingJoins.map(async (join) => {
          const parts = join.split('|')
          const { result } = await dispatch(`api/room/${parts[1]}s/push`, { room: parts[0], user: userid }, { root: true })
          await dispatch('api/message/getAll', { room: result.room }, { root: true })
        }))
          .catch((e) => {
            this.$consola.error(e)
          })
        commit('clearPendingJoins')
      }
    } catch (err) {
      handleError(err, commit)
    }
    return response
  }
}
