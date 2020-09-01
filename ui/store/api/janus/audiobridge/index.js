export const actions = {
  async createRoom ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDto = await dispatch('api/janus/session/create', null, { root: true })
    const handleDto = await dispatch('api/janus/audiobridge/handle/attach', { sessionDto, args: { } }, { root: true })
    const result = await dispatch('api/janus/audiobridge/api/create', { handleDto, payload }, { root: true })
    await dispatch('api/janus/session/destroy', { sessionDto }, { root: true })
    return result
  },

  async destroyRoom ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDto = await dispatch('api/janus/session/create', null, { root: true })
    const handleDto = await dispatch('api/janus/audiobridge/handle/attach', { sessionDto, args: {} }, { root: true })
    const result = await dispatch('api/janus/audiobridge/api/destroy', { handleDto, payload }, { root: true })
    await dispatch('api/janus/session/destroy', { sessionDto }, { root: true })
    return result
  },

  async listRooms ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDto = await dispatch('api/janus/session/create', null, { root: true })
    const handleDto = await dispatch('api/janus/audiobridge/handle/attach', { sessionDto, args: {} }, { root: true })
    const result = await dispatch('api/janus/audiobridge/api/list', { handleDto }, { root: true })
    await dispatch('api/janus/session/destroy', { sessionDto }, { root: true })
    return result
  },

  async join ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDto = await dispatch('api/janus/session/create', null, { root: true })
    const handleDto = await dispatch('api/janus/audiobridge/handle/attachPublisher', { sessionDto, args: payload.janus }, { root: true })
    const result = await dispatch('api/janus/audiobridge/api/exists', { handleDto, roomid: payload.janus.roomid }, { root: true })
    if (!result.exists) {
      await dispatch('api/janus/audiobridge/api/create', { handleDto, payload: payload.media }, { root: true })
    }
    await dispatch('api/janus/audiobridge/api/joinPublisher', { handleDto }, { root: true })
    return sessionDto
  }
}
