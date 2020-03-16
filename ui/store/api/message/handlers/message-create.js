export const handleMessageCreate = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.messageCreate) {
    if (Array.isArray(data.data) && data.data.length) {
      commit('api/message/pushAll', { roomid: data.data[0].room._id, messages: data.data }, {
        root: true
      })
    } else {
      commit('api/message/pushAll', { roomid: data.data[0].room._id, messages: [data.data] }, {
        root: true
      })
    }
    commit('playSound', 'message_create')
  }
}
