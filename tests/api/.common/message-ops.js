class MessageOps {
  create(fastify, test, testname, messageContext) {
    test.serial(`API "/api/message/create" ${testname}`, async(t) => {
      const payload = {
        message: messageContext.payload
      }
      payload.room = messageContext.room._id
      if (payload.message) {
        if (Array.isArray(payload.message)) {
          payload.message.forEach(message => {
            message.mentions = messageContext.getMentionIds(message)
          })
        } else {
          payload.message.mentions = messageContext.getMentionIds(payload.message)
        }
      }
      await fastify
        .inject({
          method: 'POST',
          url: `/api/message/create`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          },
          payload
        })
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
            t.true(payloadMessage !== null && payloadMessage !== undefined)
            t.true(message._id !== undefined)
            t.true(message.room._id.toString() === messageContext.room._id.toString())
            if (payloadMessage.type) {
              t.true(message.type === payloadMessage.type)
            }
            t.true(message.content === payloadMessage.content)
            if (payloadMessage.mentions) {
              payloadMessage.mentions.forEach(mention => {
                const foundMention = message.mentions.find(item => item._id.toString() === mention.toString())
                t.true(foundMention !== null && foundMention !== undefined)
              })
            }
            t.true(message.createdAt !== undefined)
            t.true(message.updatedAt !== undefined)
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
              const foundMention = result.mentions.find(item => item._id.toString() === mention._id.toString())
              t.true(foundMention !== null && foundMention !== undefined)
            })
          }
          t.true(result.createdAt !== undefined)
          t.true(result.updatedAt !== undefined)

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
          result.forEach(message => {
            const expectedMessage = expectedMessages.find(m => m._id.toString() === message._id.toString())
            t.true(expectedMessage !== null && expectedMessage !== undefined)
            t.true(message._id !== undefined)
            t.true(message.room._id.toString() === messageContexts[0].records[0].room._id.toString())
            if (expectedMessage.type) {
              t.true(message.type === expectedMessage.type)
            }
            t.true(message.content === expectedMessage.content)
            if (expectedMessage.mentions) {
              expectedMessage.mentions.forEach(mention => {
                const foundMention = message.mentions.find(item => item._id.toString() === mention._id.toString())
                t.true(foundMention !== null && foundMention !== undefined)
              })
            }
            t.true(message.createdAt !== undefined)
            t.true(message.updatedAt !== undefined)
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
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/message/update/${messageContext.records[0]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result._id !== undefined)
          t.true(result.room._id.toString() === messageContext.room._id.toString())
          if (payload.type) {
            t.true(result.type === payload.type)
          }
          t.true(result.content === payload.content)
          if (payload.mentions) {
            payload.mentions.forEach(mention => {
              const foundMention = result.mentions.find(item => item._id.toString() === mention.toString())
              t.true(foundMention !== null && foundMention !== undefined)
            })
          }
          t.true(result.createdAt !== undefined)
          t.true(result.updatedAt !== undefined)
          messageContext.records = messageContext.records.map(r => r._id.toString() === result._id.toString() ? result : r)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, messageContext) {
    test.serial(`API "/api/message/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/message/delete/${messageContext.records[0]._id}`,
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
          t.true(result.createdAt !== undefined)
          t.true(result.updatedAt !== undefined)
          const found = result.readby.find(readby => readby._id.toString() === userContext.record._id.toString())
          t.true(found._id !== undefined)
          t.true(found.username === userContext.record.username)
          t.true(found.email === userContext.record.email)
          t.true(found.password === undefined)
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
          t.true(result.createdAt !== undefined)
          t.true(result.updatedAt !== undefined)
          const found = result.readby.find(readby => readby._id.toString() === userContext.record._id.toString())
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
