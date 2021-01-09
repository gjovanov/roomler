export const handleInviteDelete = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.roomInviteDelete) {
    data.data.forEach((invite) => {
      commit('api/invite/pull', invite, {
        root: true
      })
    })
  }
}
