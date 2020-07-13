const UnauthorizedError = require('../../../errors/unauthorized-error.js')
module.exports = (tokenUser, dbUser) => {
  const errors = []
  if (!dbUser ||
    !dbUser._id ||
    !tokenUser ||
    !tokenUser._id ||
    tokenUser._id.toString() !== dbUser._id.toString() ||
    tokenUser.username !== dbUser.username) {
    errors.push({
      prop: 'token',
      message: 'Invalid authentication token.'
    })
  }

  if (errors.length) {
    throw new UnauthorizedError(errors)
  }
}
