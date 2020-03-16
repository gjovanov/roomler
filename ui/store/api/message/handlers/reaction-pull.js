export const handleReactionPull = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.messageReactionPull) {
    if (Array.isArray(data.data) && data.data.length) {
      commit('api/message/pushAll', { roomid: data.data[0].room._id, messages: data.data }, {
        root: true
      })
    } else {
      commit('api/message/pushAll', { roomid: data.data[0].room._id, messages: [data.data] }, {
        root: true
      })
    }
    commit('playSound', 'reaction_pull')
  }
}
