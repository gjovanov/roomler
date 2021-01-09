export const handleError = (err, commit) => {
  const data = err && err.response && err.response.data ? err.response.data : err
  if (Array.isArray(data.errors)) {
    const invalidToken = data.errors.find(e => e.prop === 'token')
    if (invalidToken) {
      commit('api/auth/clearUserInfo', null, { root: true })
    } else {
      data.errors.forEach((e) => {
        e.error = true
        commit('toast/push', e, {
          root: true
        })
      })
    }
  } else {
    let prop = data && data.name ? data.name : 'unexpected'
    let message = data && data.message ? data.message : data
    if (message.includes('E11000 duplicate key error collection')) {
      const index = message.indexOf('{')
      prop = 'global'
      message = `${message.substring(index)} is taken`
    }
    commit('toast/push', {
      prop,
      message,
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
