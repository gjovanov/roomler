export const handleHello = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.hello) {
    commit('api/auth/setHello', data.data, {
      root: true
    })
  }
}
