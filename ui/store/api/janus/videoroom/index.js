export const actions = {
  async createRoom ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDTO = await dispatch('api/janus/session/create', null, { root: true })
    const handleDTO = await dispatch('api/janus/handle/attach', { sessionDTO, args: { } }, { root: true })
    const result = await dispatch('api/janus/videoroom/api/create', { handleDTO, payload }, { root: true })
    await dispatch('api/janus/session/destroy', { sessionDTO }, { root: true })
    return result
  },

  async destroyRoom ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDTO = await dispatch('api/janus/session/create', null, { root: true })
    const handleDTO = await dispatch('api/janus/handle/attach', { sessionDTO, args: {} }, { root: true })
    const result = await dispatch('api/janus/videoroom/api/destroy', { handleDTO, payload }, { root: true })
    await dispatch('api/janus/session/destroy', { sessionDTO }, { root: true })
    return result
  },

  async listRooms ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDTO = await dispatch('api/janus/session/create', null, { root: true })
    const handleDTO = await dispatch('api/janus/handle/attach', { sessionDTO, args: {} }, { root: true })
    const result = await dispatch('api/janus/videoroom/api/list', { handleDTO }, { root: true })
    await dispatch('api/janus/session/destroy', { sessionDTO }, { root: true })
    return result
  },

  async join ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDTO = await dispatch('api/janus/session/create', null, { root: true })
    const handleDTO = await dispatch('api/janus/handle/attachPublisher', { sessionDTO, args: payload.janus }, { root: true })
    const result = await dispatch('api/janus/videoroom/api/exists', { handleDTO, roomid: payload.janus.roomid }, { root: true })
    if (!result.exists) {
      await dispatch('api/janus/videoroom/api/create', { handleDTO, payload: payload.media }, { root: true })
    }
    await dispatch('api/janus/videoroom/api/joinPublisher', { handleDTO }, { root: true })
    return sessionDTO
  },

  async shareScreen ({
    commit,
    dispatch,
    rootState
  }, payload) {
    const handleDTO = await dispatch('api/janus/handle/attachPublisher', { sessionDTO: payload.sessionDTO, args: payload.janus }, { root: true })
    await dispatch('api/janus/videoroom/api/joinPublisher', { handleDTO }, { root: true })
    return handleDTO
  }
}
