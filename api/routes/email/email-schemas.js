const S = require('fluent-schema')

const emailTypes = ['template', 'direct']

const getQueryString = S.object()
  .prop('id', S.string().required())

const getAllQueryString = S.object()
  .prop('page', S.integer())
  .prop('size', S.integer())

const attachment = S.object()
  .prop('_id', S.string())
  .prop('filename', S.string())
  .prop('content', S.string())
  .prop('path', S.string())
  .prop('href', S.string())
  .prop('contentType', S.string())
  .prop('contentDecomposition', S.string())
  .prop('cid', S.string())
  .prop('encoding', S.string())

const attachmentList = S.array().items(attachment)

const email = S.object()
  .prop('_id', S.string())
  .prop('from', S.string())
  .prop('to', S.string())
  .prop('cc', S.string())
  .prop('type', S.string())
  .prop('subject', S.string())
  .prop('body', S.string().required())
  .prop('attachments', attachmentList)
  .prop('createdAt', S.string())
  .prop('updatedAt', S.string())

const emailList = S.array().items(email)

const sendBody = S.object()
  .prop('type', S.string().enum(emailTypes).required())
  .prop('template', S.string())
  .prop('model', S.object())
  .prop('body', S.string())
  .prop('from', S.string())
  .prop('to', S.string().required())
  .prop('attachments', attachmentList)
  .allOf([
    S.ifThen(S.object()
      .prop('type', S.string())
      .enum(['template']),
    S.required(['template', 'model'])),
    S.ifThen(S.object()
      .prop('type', S.string())
      .enum(['direct']),
    S.required(['body']))
  ])

const deleteParams = S.object()
  .prop('id', S.string().required())

const delete200 = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

module.exports = {
  get: {
    querystring: getQueryString,
    response: {
      200: email
    }
  },
  getAll: {
    querystring: getAllQueryString,
    response: {
      200: emailList
    }
  },
  send: {
    body: sendBody,
    response: {
      200: email
    }
  },
  delete: {
    params: deleteParams,
    response: {
      200: delete200
    }
  }
}
