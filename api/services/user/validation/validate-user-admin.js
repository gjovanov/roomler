const UnauthorizedError = require('../../../errors/unauthorized-error.js')
module.exports = (tokenUser) => {
  const errors = []
  if (!tokenUser ||
    !tokenUser.is_admin) {
    errors.push({
      prop: 'user',
      message: 'Unauthorized operation.'
    })
  }

  if (errors.length) {
    throw new UnauthorizedError(errors)
  }
}
