const { v4: uuid } = require('uuid')
class MessageOps {

  createWs(ws, op, payload) {
    const msg = JSON.stringify({
      op,
      payload
    })
    ws.send(msg)
  }
  async createApi(fastify, token, payload) {
    const result = await fastify
      .inject({
        method: 'POST',
        url: `/api/message/create`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        payload
      })
    return result
  }

  async updateApi(fastify, token, roomid, payload) {
    const result = await fastify
      .inject({
        method: 'PUT',
        url: `/api/message/update/${roomid}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        payload
      })
    return result
  }

  create(fastify, test, testname, messageContext) {
    test.serial(`API "/api/message/create" ${testname}`, async(t) => {
      const payload = {
        message: messageContext.payload
      }
      payload.room = messageContext.room._id
      if (payload.message) {
        if (Array.isArray(payload.message)) {
          payload.message.forEach(message => {
            message.client_id = uuid()
            message.mentions = messageContext.getMentionIds(message)
          })
        } else {
          payload.message.client_id = uuid()
          payload.message.mentions = messageContext.getMentionIds(payload.message)
        }
      }
      await this.createApi(fastify, messageContext.token, payload)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          const payloadMessages = Array.isArray(payload.message) ? payload.message : [payload.message]
          t.true(Array.isArray(result))
          if (Array.isArray(payload.message)) {
            t.true(result.length === payload.message.length)
          } else {
            t.true(result.length === 1)
          }
          result.forEach(message => {
            const payloadMessage = payloadMessages.find(m => m.content === message.content)
            t.true(!!payloadMessage)
            t.true(!!message._id)
            t.true(message.room._id.toString() === messageContext.room._id.toString())
            if (payloadMessage.type) {
              t.true(message.type === payloadMessage.type)
            }
            t.true(message.content === payloadMessage.content)
            if (payloadMessage.mentions) {
              payloadMessage.mentions.forEach(mention => {
                const foundMention = message.mentions.find(item => item.toString() === mention.toString())
                t.true(!!foundMention)
              })
            }
            t.true(!!message.createdAt)
            t.true(!!message.updatedAt)
            messageContext.records.push(message)
          })

          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  get(fastify, test, testname, messageContext) {
    test.serial(`API "/api/message/get-all" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/message/get?id=${messageContext.records[0]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result._id.toString() === messageContext.records[0]._id.toString())
          t.true(result.room._id.toString() === messageContext.records[0].room._id.toString())
          t.true(result.type === messageContext.records[0].type)
          t.true(result.content === messageContext.records[0].content)
          if (messageContext.records[0].mentions) {
            messageContext.records[0].mentions.forEach(mention => {
              const foundMention = result.mentions.find(item => item.toString() === mention.toString())
              t.true(!!foundMention)
            })
          }
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)

          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/message/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/message/get?id=${invalidId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'TypeError')
          t.true(result.message === 'Invalid message id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getNotFoundId(fastify, test, testname, messageContext, recordIndex) {
    test.serial(`API "/api/message/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/message/get?id=${messageContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Message was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getAll(fastify, test, testname, messageContexts) {
    test.serial(`API "/api/message/get-all" ${testname}`, async(t) => {
      const expectedMessages = messageContexts.map(mc => mc.records).reduce((a, b) => [...a, ...b])
      
      await fastify
        .inject({
          method: 'GET',
          url: `/api/message/get-all?room=${messageContexts[0].records[0].room._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContexts[0].token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result))
          expectedMessages.forEach(expectedMessage => {
            const message = result.find(m => m._id.toString() === expectedMessage._id.toString())
            t.true(!!message)
            t.true(!!expectedMessage._id)
            t.true(expectedMessage.room._id.toString() === messageContexts[0].records[0].room._id.toString())
            if (message.type) {
              t.true(expectedMessage.type === message.type)
            }
            t.true(expectedMessage.content === message.content)
            if (message.mentions) {
              message.mentions.forEach(mention => {
                const foundMention = expectedMessage.mentions.find(item => item.toString() === mention.toString())
                t.true(!!foundMention)
              })
            }
            t.true(!!expectedMessage.createdAt)
            t.true(!!expectedMessage.updatedAt)
          })

          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  update(fastify, test, testname, messageContext) {
    test.serial(`API "/api/message/update/:id" ${testname}`, async(t) => {
      const payload = messageContext.update
      payload.mentions = messageContext.getMentionIds(payload)
      await this.updateApi(fastify, messageContext.token, messageContext.records[0]._id, payload)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result._id)
          t.true(result.room._id.toString() === messageContext.room._id.toString())
          if (payload.type) {
            t.true(result.type === payload.type)
          }
          t.true(result.content === payload.content)
          if (payload.mentions) {
            payload.mentions.forEach(mention => {
              const foundMention = result.mentions.find(item => item.toString() === mention.toString())
              t.true(!!foundMention)
            })
          }
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          messageContext.records = messageContext.records.map(r => r._id.toString() === result._id.toString() ? result : r)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  updateInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/message/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/message/update/${invalidId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'TypeError')
          t.true(result.message === 'Invalid message id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
  updateNotFoundId(fastify, test, testname, messageContext, recordIndex) {
    test.serial(`API "/api/message/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/message/update/${messageContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Message was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, messageContext, recordIndex) {
    test.serial(`API "/api/message/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/message/delete/${messageContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.ok === 1)
          t.true(result.n > 0)
          t.true(result.deletedCount > 0)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/message/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/message/delete/${invalidId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'TypeError')
          t.true(result.message === 'Invalid message id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteNotFoundId(fastify, test, testname, messageContext, recordIndex) {
    test.serial(`API "/api/message/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/message/delete/${messageContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Message was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  read(fastify, test, testname, messageContext, userContext) {
    test.serial(`API "/api/message/readby/push/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/message/readby/push/${messageContext.records[0]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result._id.toString() === messageContext.records[0]._id.toString())
          t.true(result.content === messageContext.records[0].content)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          t.true(result.is_read)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  readAll(fastify, test, testname, messageContext, userContext) {
    const ids = messageContext.records.map(r => r._id)
    test.serial(`API "/api/message/readby/pushAll" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/message/readby/pushAll`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          },
          payload: ids
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result))
          t.true(result.length === ids.length)
          t.true(result.filter(m => !m.is_read).length === 0)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  unread(fastify, test, testname, messageContext, userContext) {
    test.serial(`API "/api/message/readby/pull/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/message/readby/pull/${messageContext.records[0]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result._id.toString() === messageContext.records[0]._id.toString())
          t.true(result.content === messageContext.records[0].content)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          t.false(result.is_read)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  react(fastify, test, testname, messageContext, userContext, reaction) {
    const payload = reaction
    test.serial(`API "/api/message/reactions/push/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/message/reactions/push/${messageContext.records[0]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result._id.toString() === messageContext.records[0]._id.toString())
          t.true(result.content === messageContext.records[0].content)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          const found = result.reactions.find(reaction => reaction.user.toString() === userContext.record._id.toString())
          t.true(!!found)
          t.true(found.type === reaction.type)
          t.true(found.symbol === reaction.symbol)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  unreact(fastify, test, testname, messageContext, userContext) {
    test.serial(`API "/api/message/reactions/pull/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/message/reactions/pull/${messageContext.records[0]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result._id.toString() === messageContext.records[0]._id.toString())
          t.true(result.content === messageContext.records[0].content)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          const found = result.reactions.find(reaction => reaction.user.toString() === userContext.record._id.toString())
          t.true(!found)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
}

module.exports = new MessageOps()
