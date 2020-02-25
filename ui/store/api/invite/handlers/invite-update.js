export const handleInviteUpdate = (
  commit,
  state,
  rootState,
  router,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.roomInviteUpdate) {
    data.data.forEach((invite) => {
      commit('api/invite/replace', invite, {
        root: true
      })
    })
  }
}
