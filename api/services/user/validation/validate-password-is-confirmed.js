const ValidationError = require('../../../errors/validation-error.js')
module.exports = (password, passwordConfirm) => {
  const errors = []
  const isMatch = password === passwordConfirm

  if (!isMatch) {
    errors.push({
      prop: 'password',
      message: 'Passwords don\'t match.'
    })
  }
  if (errors.length) {
    throw new ValidationError(errors)
  }
}
