const endOfLine = require('os').EOL
class UnauthorizedError extends Error {
  constructor (errors) {
    super('')
    this.name = 'UnauthorizedError'
    this.errors = errors
    this.message = ''
    this.errors.forEach((error) => {
      this.message += `${error.prop}: ${error.message}${endOfLine}`
    })
    super.message = this.message
  }
}
module.exports = UnauthorizedError
