export const handleError = (err, commit) => {
  if (Array.isArray(err.errors)) {
    err.errors.forEach((e) => {
      e.error = true
      commit('toast/push', e, {
        root: true
      })
    })
  } else {
    commit('toast/push', {
      prop: err.name,
      message: err.message,
      error: true
    }, {
      root: true
    })
  }
}

export const handleSuccess = (message, commit) => {
  const toast = {
    prop: 'global',
    message,
    error: false
  }
  commit('toast/push', toast, {
    root: true
  })
}
