
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
  async leave ({
    commit,
    dispatch,
    state
  }) {
    const handleDto = state.session.handleDtos.find(h => h.isLocal)
    const session = await dispatch('api/janus/session/destroy', { sessionDto: state.session }, { root: true })
    if (handleDto && handleDto.isLocal) {
      await dispatch('api/room/calls/closeCall', {
        room: handleDto.room._id,
        id: handleDto.call_id
      }, {
        root: true
      })
    }
    commit('set', { session, room: null })
  }
}

export const getters = {
  localHandle: (state) => {
    return state.session && state.session.handleDtos ? state.session.handleDtos.find(h => h.isLocal) : null
  }
}
