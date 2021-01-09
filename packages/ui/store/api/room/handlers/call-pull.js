export const handleCallPull = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (
    data.op === rootState.api.config.config.wsSettings.opTypes.roomCallClose) {
    data.data.forEach((record) => {
      commit('api/room/calls/pullCall', record.call, {
        root: true
      })
      commit('api/room/push', record.room, {
        root: true
      })
    })
  }
}
