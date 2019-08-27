const ValidationError = require('../../../errors/validation-error.js')
module.exports = (data) => {
  const errors = []
  if (!data || !data._id) {
    errors.push({
      prop: 'code',
      message: 'Invalid or expired activation code.'
    })
  }
  if (errors.length) {
    throw new ValidationError(errors)
  }
}
