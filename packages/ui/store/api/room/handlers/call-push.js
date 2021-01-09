export const handleCallPush = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (
    data.op === rootState.api.config.config.wsSettings.opTypes.roomCallOpen) {
    data.data.forEach((record) => {
      commit('api/room/calls/pushCall', record.call, {
        root: true
      })
      commit('api/room/push', record.room, {
        root: true
      })
    })
  }
}
