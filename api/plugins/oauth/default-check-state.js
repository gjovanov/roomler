module.exports = function (defaultState, state, callback) {
  if (process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test') {
    callback()
  } else {
    if (state === defaultState) {
      callback()
      return
    }
    callback(new Error('Invalid state'))
  }
}
