const endOfLine = require('os').EOL
class ValidationError extends Error {
  constructor (errors) {
    super('')
    this.name = 'ValidationError'
    this.errors = errors
    this.message = ''
    this.errors.forEach((error) => {
      this.message += `${error.prop}: ${error.message}${endOfLine}`
    })
    super.message = this.message
  }
}
module.exports = ValidationError
