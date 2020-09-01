
export const state = () => ({
  session: null,
  room: null
})

export const mutations = {
  set (state, { session, room }) {
    state.session = session
    state.room = room
  },
  setPosition (state, position) {
    state.position = position
  }
}

export const actions = {
  async join ({
    commit,
    dispatch,
    state
  }, { janusPayload, room }) {
    const session = await dispatch('api/janus/videoroom/join', janusPayload, { root: true })
    commit('set', { session, room })
  },
  leave ({
    commit,
    dispatch,
    getters,
    state
  }) {
    const localHandle = getters.localHandle
    if (localHandle) {
      dispatch('api/room/calls/closeCall', {
        id: localHandle.call_id
      }, {
        root: true
      })
    }
    dispatch('api/janus/session/destroy', { sessionDto: state.session }, { root: true })
    commit('set', { session: null, room: null })
  }
}

export const getters = {
  localHandle: (state) => {
    return state.session && state.session.videoroomHandles ? state.session.videoroomHandles.find(h => h.isLocal) : null
  },

  localSipHandle: (state) => {
    return state.session && state.session.sipHandles ? state.session.sipHandles.find(h => h.isLocal) : null
  },
  remoteSipHandle: (state) => {
    return state.session && state.session.sipHandles ? state.session.sipHandles.find(h => !h.isLocal) : null
  }
}
