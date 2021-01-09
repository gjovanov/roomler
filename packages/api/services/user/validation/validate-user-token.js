const UnauthorizedError = require('../../../errors/unauthorized-error.js')
module.exports = (tokenUser) => {
  const errors = []
  if (
    !tokenUser ||
    !tokenUser._id) {
    errors.push({
      prop: 'token',
      message: 'Invalid authentication token.'
    })
  }

  if (errors.length) {
    throw new UnauthorizedError(errors)
  }
}
