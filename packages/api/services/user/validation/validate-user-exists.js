const ValidationError = require('../../../errors/validation-error.js')
module.exports = (data) => {
  const errors = []
  if (!data || !data._id) {
    errors.push({
      prop: 'username',
      message: 'User doesn\'t exist.'
    })
  }
  if (errors.length) {
    throw new ValidationError(errors)
  }
}
