export const handlePeerPush = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (
    data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerRoleUpdate ||
      data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerAdd ||
      data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerJoin) {
    data.data.forEach((record) => {
      record.users.forEach((user) => {
        commit('api/auth/push', user, {
          root: true
        })
      })
      commit('api/room/push', record.room, {
        root: true
      })
    })
  }
}
