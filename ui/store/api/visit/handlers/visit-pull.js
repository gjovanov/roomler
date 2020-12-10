export const handleVisitPull = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (
    data.op === rootState.api.config.config.wsSettings.opTypes.visitClose) {
    data.data.forEach((record) => {
      commit('api/visit/pull', record, {
        root: true
      })
    })
  }
}
