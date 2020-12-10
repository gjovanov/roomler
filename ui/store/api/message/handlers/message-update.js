export const handleMessageUpdate = async (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.messageUpdate) {
    if (Array.isArray(data.data) && data.data.length) {
      commit('api/message/pushAll', { roomid: data.data[0].room._id, messages: data.data }, {
        root: true
      })
    } else {
      commit('api/message/pushAll', { roomid: data.data[0].room._id, messages: [data.data] }, {
        root: true
      })
    }
    await dispatch('sound/playSound', 'message_create', { root: true })
  }
}
