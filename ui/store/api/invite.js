import {
  storage
} from '@/services/storage'
import {
  handleError,
  handleSuccess
} from '@/services/ajax-handlers'

export const state = () => ({
  invites: [],
  pendingInvites: []
})

export const mutations = {
  storePendingInvites (state, invite) {
    const result = []
    if (invite) {
      result.push(invite)
    }

    // Merge with Cookie Pending Invites
    let invites = storage.get('pendingInvites')
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
    storage.set('pendingInvites', JSON.stringify(state.pendingInvites), true)
  },
  clearPendingInvites (state) {
    state.pendingInvites = []
    storage.set('pendingInvites', state.pendingInvites, true)
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
    commit,
    state,
    rootState
  }, router) {
    this.$wss.subscribe('onmessage', (message) => {
      const data = JSON.parse(message.data)
      if (data.op === rootState.api.config.config.wsSettings.opTypes.roomInviteAccept) {
        data.data.forEach((invite) => {
          commit('api/invite/replace', invite, {
            root: true
          })
          commit('api/auth/push', invite.invitee, {
            root: true
          })
          commit('api/room/pushUser', invite, {
            root: true
          })
          if (invite.inviter._id === rootState.api.auth.user._id) {
            handleSuccess(`'${invite.name}' invited by, has joined the room '${invite.room.path}' under username '${invite.invitee.username}'`, commit)
          } else if (invite.invitee._id === rootState.api.auth.user._id) {
            handleSuccess(`You has joined the room '${invite.room.path}'`, commit)
          } else {
            handleSuccess(`'${invite.invitee.username}' has joined the room '${invite.room.path}'`, commit)
          }
        })
      } else if (data.op === rootState.api.config.config.wsSettings.opTypes.roomInviteUpdate) {
        data.data.forEach((invite) => {
          commit('api/invite/replace', invite, {
            root: true
          })
        })
      } else if (data.op === rootState.api.config.config.wsSettings.opTypes.roomInviteDelete) {
        data.data.forEach((invite) => {
          commit('api/invite/pull', invite, {
            root: true
          })
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
  }
}
