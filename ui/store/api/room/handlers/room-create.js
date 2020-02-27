export const handleRoomCreate = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.roomCreate) {
    data.data.forEach((room) => {
      commit('api/room/push', room, {
        root: true
      })
      commit('api/room/open', room, {
        root: true
      })
    })
  }
}
