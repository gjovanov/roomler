const ValidationError = require('./validation-error')
const UnauthorizedError = require('./unauthorized-error')
const errorHandler = (error, request, reply) => {
  request.log.error(error)
  if (error instanceof ValidationError) {
    reply.code(409).send({
      errors: error.errors
    })
  } else if (error instanceof UnauthorizedError) {
    reply.code(401).send({
      errors: error.errors
    })
  } else {
    reply.code(500).send({
      name: error.name,
      message: error.message
    })
  }
}
module.exports = errorHandler
