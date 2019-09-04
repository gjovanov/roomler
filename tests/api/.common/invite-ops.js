class InviteOps {
  create(fastify, test, testname, inviteContext) {
    test.serial(`API "/api/invite/create" ${testname}`, async(t) => {
      const payload = {
        message: inviteContext.payload
      }
      payload.room = inviteContext.room._id
      if (payload.message) {
        if (Array.isArray(payload.message)) {
          payload.message.forEach(message => {
            message.mentions = inviteContext.getMentionIds(message)
          })
        } else {
          payload.message.mentions = inviteContext.getMentionIds(payload.message)
        }
      }
      await fastify
        .inject({
          method: 'POST',
          url: `/api/invite/create`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${inviteContext.token}`
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
            t.true(!!payloadMessage)
            t.true(!!message._id)
            t.true(message.room._id.toString() === inviteContext.room._id.toString())
            if (payloadMessage.type) {
              t.true(message.type === payloadMessage.type)
            }
            t.true(message.content === payloadMessage.content)
            if (payloadMessage.mentions) {
              payloadMessage.mentions.forEach(mention => {
                const foundMention = message.mentions.find(item => item._id.toString() === mention.toString())
                t.true(!!foundMention)
              })
            }
            t.true(!!message.createdAt)
            t.true(!!message.updatedAt)
            inviteContext.records.push(message)
          })

          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
}

module.exports = new InviteOps()
