export const handleError = (err, commit) => {
  console.log(err)
  const data = err.response.data
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
    if (data.message && data.message.includes('E11000 duplicate key error collection')) {
      const index = data.message.indexOf('{')
      data.name = 'global'
      data.message = `${data.message.substring(index)} is taken`
    }
    commit('toast/push', {
      prop: data.name,
      message: data.message,
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
