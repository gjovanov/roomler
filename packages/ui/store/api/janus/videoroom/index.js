export const actions = {
  async createRoom ({
    commit,
    dispatch,
    rootState
  }, payload) {
    await dispatch('api/janus/session/init', true, { root: true })
    const sessionDto = await dispatch('api/janus/session/create', null, { root: true })
    const handleDto = await dispatch('api/janus/videoroom/handle/attach', { sessionDto, args: { } }, { root: true })
    const result = await dispatch('api/janus/videoroom/api/create', { handleDto, payload }, { root: true })
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
    const handleDto = await dispatch('api/janus/videoroom/handle/attach', { sessionDto, args: {} }, { root: true })
    const result = await dispatch('api/janus/videoroom/api/destroy', { handleDto, payload }, { root: true })
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
    const handleDto = await dispatch('api/janus/videoroom/handle/attach', { sessionDto, args: {} }, { root: true })
    const result = await dispatch('api/janus/videoroom/api/list', { handleDto }, { root: true })
    await dispatch('api/janus/session/destroy', { sessionDto }, { root: true })
    return result
  },

  async join ({
    commit,
    dispatch,
    rootState
  }, { sessionDto, janusPayload, room }) {
    const handleDto = await dispatch('api/janus/videoroom/handle/attachPublisher', { sessionDto, args: janusPayload.janus }, { root: true })
    const result = await dispatch('api/janus/videoroom/api/exists', { handleDto, roomid: janusPayload.janus.roomid }, { root: true })
    if (!result.exists) {
      await dispatch('api/janus/videoroom/api/create', { handleDto, payload: janusPayload.media }, { root: true })
    }
    await dispatch('api/janus/videoroom/api/joinPublisher', { handleDto, stream: janusPayload.stream }, { root: true })
  }
}
