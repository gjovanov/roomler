export const handleVisitPush = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (
    data.op === rootState.api.config.config.wsSettings.opTypes.visitOpen) {
    data.data.forEach((record) => {
      commit('api/visit/push', record, {
        root: true
      })
    })
  }
}
