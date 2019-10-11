export const handleError = (err, commit) => {
  const data = err.response.data
  if (Array.isArray(data.errors)) {
    data.errors.forEach((e) => {
      e.error = true
      commit('toast/push', e, {
        root: true
      })
    })
  } else {
    if (data.message.includes('E11000 duplicate key error collection')) {
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
