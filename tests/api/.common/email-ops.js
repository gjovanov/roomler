class EmailOps {
  send(fastify, test, testname, emailContext) {
    test.serial(`API "/api/email/send" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'POST',
          url: `/api/email/send`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${emailContext.token}`
          },
          payload: emailContext.payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result._id)
          t.true(!!result.from)
          t.true(result.to === emailContext.payload.to)
          t.true(result.subject === emailContext.payload.subject)
          t.true(!!result.body)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          emailContext.record = result
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  get(fastify, test, testname, emailContext) {
    test.serial(`API "/api/email/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/email/get?id=${emailContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${emailContext.token}`
          },
          payload: emailContext.payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result._id.toString() === emailContext.record._id.toString())
          t.true(result.from === emailContext.record.from)
          t.true(result.to === emailContext.record.to)
          t.true(result.subject === emailContext.record.subject)
          t.true(result.body === emailContext.record.body)
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
    test.serial(`API "/api/email/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/email/get?id=${invalidId}`,
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
          t.true(result.message === 'Invalid email id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getNotFoundId(fastify, test, testname, emailContext) {
    test.serial(`API "/api/email/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/email/get?id=${emailContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${emailContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Email was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getAll(fastify, test, testname, emailContexts) {
    test.serial(`API "/api/email/get-all" ${testname}`, async(t) => {
      const expectedEmails = emailContexts.map(ec => ec.record)
      await fastify
        .inject({
          method: 'GET',
          url: `/api/email/get-all`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${emailContexts[0].token}`
          },
          payload: emailContexts.payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result))
          expectedEmails.forEach(expectedEmail => {
            const email = result.find(e => e._id.toString() === expectedEmail._id.toString())
            t.true(!!email)
            t.true(expectedEmail._id.toString() === email._id.toString())
            t.true(expectedEmail.from === email.from)
            t.true(expectedEmail.to === email.to)
            t.true(expectedEmail.subject === email.subject)
            t.true(expectedEmail.body === email.body)
            t.true(!!expectedEmail.createdAt)
            t.true(!!expectedEmail.updatedAt)
          })
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, emailContext) {
    test.serial(`API "/api/email/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/email/delete/${emailContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${emailContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const payload = JSON.parse(response.payload)
          t.true(payload.ok === 1)
          t.true(payload.n > 0)
          t.true(payload.deletedCount > 0)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/email/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/email/delete/${invalidId}`,
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
          t.true(result.message === 'Invalid email id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteNotFoundId(fastify, test, testname, emailContext) {
    test.serial(`API "/api/email/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/email/delete/${emailContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${emailContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Email was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
}

module.exports = new EmailOps()
