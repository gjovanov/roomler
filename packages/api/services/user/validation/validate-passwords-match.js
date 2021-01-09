const ValidationError = require('../../../errors/validation-error.js')
module.exports = async (user, password) => {
  const errors = []
  const isMatch = await user.comparePassword(password)
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
