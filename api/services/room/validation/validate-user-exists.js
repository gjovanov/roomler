const ValidationError = require('../../../errors/validation-error.js')
module.exports = (data) => {
  const errors = []
  if (!data) {
    errors.push({
      prop: 'token',
      message: 'The user you are logged in with, doesn\'t exit in the DB.'
    })
  }
  if (errors.length) {
    throw new ValidationError(errors)
  }
}
