export const handleCallPull = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  data) => {
  if (
    data.op === rootState.api.config.config.wsSettings.opTypes.roomCallClose) {
    data.data.forEach((record) => {
      record.call.forEach((call) => {
        commit('api/room/calls/pushCall', record.call, {
          root: true
        })
        commit('api/room/push', record.room, {
          root: true
        })
      })
    })
  }
}
