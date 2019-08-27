import Headers from '~/services/headers'

export const state = () => ({
  room: null,
  rooms: []
})

export const mutations = {
  roomCreated (state, room) {
    state.room = room
  },

  roomLoaded (state, room) {
    state.room = room
  },

  roomsLoaded (state, rooms) {
    state.rooms = rooms
  }
}

export const actions = {
  create ({
    commit,
    state
  }, room) {
    return this.$axios
      .$post('/api/room/create', {
        room
      }, {
        headers: Headers.getHeaders()
      })
      .then((response) => {
        commit('roomCreated', response.data.result)
        return {
          data: response && response.data ? response.data.result : null,
          success: true
        }
      })
      .catch((error) => {
        return {
          error,
          success: false
        }
      })
  },

  get ({
    commit,
    state
  }, id) {
    return this.$axios
      .$get(`/api/room/get?id=${id}`, {
        headers: Headers.getHeaders()
      })
      .then((response) => {
        commit('roomsLoaded', response.data.result)
        return {
          data: response && response.data ? response.data.result : [],
          success: true
        }
      })
      .catch((error) => {
        return {
          error,
          success: false
        }
      })
  },

  getAll ({
    commit,
    state
  }) {
    return this.$axios
      .$get('/api/room/get-all', {
        headers: Headers.getHeaders()
      })
      .then((response) => {
        commit('roomsLoaded', response.data.result)
        return {
          data: response && response.data ? response.data.result : [],
          success: true
        }
      })
      .catch((error) => {
        return {
          error,
          success: false
        }
      })
  }
}
