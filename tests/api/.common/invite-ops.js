class InviteOps {

  async createApi(fastify, token, payload) {
    const result = await fastify
      .inject({
        method: 'POST',
        url: `/api/invite/create`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        payload
      })
    return result
  }

  async acceptApi(fastify, token, inviteid) {
    const result = await fastify
      .inject({
        method: 'PUT',
        url: `/api/invite/accept/${inviteid}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        payload: {}
      })
    return result
  }

  create(fastify, test, testname, inviteContext) {
    test.serial(`API "/api/invite/create" ${testname}`, async(t) => {
      const payload = inviteContext.payload
      payload.forEach((invite) => {
        invite.room = inviteContext.roomContext.record._id
      })
      await this.createApi(fastify, inviteContext.token, payload)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result))
          t.true(result.length === payload.length)
          payload.forEach(payloadInvite => {
            const invite = result.find(i => i.email === payloadInvite.email)
            t.true(!!invite)
            t.true(invite.room._id.toString() === inviteContext.room._id.toString())
            t.true(invite.type === payloadInvite.type)
            t.true(invite.status === 'pending')
            t.true(!!invite.createdAt)
            t.true(!!invite.updatedAt)
            inviteContext.records.push(invite)
          })
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  get(fastify, test, testname, inviteContext) {
    test.serial(`API "/api/invite/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/invite/get?id=${inviteContext.records[0]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${inviteContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result._id)
          t.true(result.room._id.toString() === inviteContext.room._id.toString())
          t.true(!!result.type)
          t.true(!!result.status)
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
    test.serial(`API "/api/invite/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/invite/get?id=${invalidId}`,
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
          t.true(result.message === 'Invalid invite id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getNotFoundId(fastify, test, testname, inviteContext, recordIndex) {
    test.serial(`API "/api/invite/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/invite/get?id=${inviteContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${inviteContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Invite was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
  getAll(fastify, test, testname, inviteContexts) {
    test.serial(`API "/api/invite/get-all" ${testname}`, async(t) => {
      const expectedInvites = inviteContexts.map(i => i.records).reduce((a, b) => [...a, ...b])
      await fastify
        .inject({
          method: 'GET',
          url: `/api/invite/get-all?room=${inviteContexts[0].records[0].room._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${inviteContexts[0].token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result))
          expectedInvites.forEach(expectedInvite => {
            const invite = result.find(m => m._id.toString() === expectedInvite._id.toString())
            t.true(!!invite)
            t.true(!!expectedInvite._id)
            t.true(expectedInvite.room._id.toString() === inviteContexts[0].records[0].room._id.toString())
            t.true(expectedInvite.type === invite.type)
            t.true(expectedInvite.status === invite.status)
            t.true(!!expectedInvite.createdAt)
            t.true(!!expectedInvite.updatedAt)
          })

          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  update(fastify, test, testname, inviteContext) {
    test.serial(`API "/api/invite/update/:id" ${testname}`, async(t) => {
      const payload = inviteContext.update
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/invite/update/${inviteContext.records[0]._id}`,
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
          t.true(!!result._id)
          t.true(result.room._id.toString() === inviteContext.room._id.toString())
          if (payload.name) {
            t.true(result.name === payload.name)
          }
          if (payload.email) {
            t.true(result.email === payload.email)
          }
          if (payload.type) {
            t.true(result.type === payload.type)
          }
          t.true(!!result.status)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          inviteContext.records = inviteContext.records.map(r => r._id.toString() === result._id.toString() ? result : r)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  updateInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/invite/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/invite/update/${invalidId}`,
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
          t.true(result.message === 'Invalid invite id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
  updateNotFoundId(fastify, test, testname, inviteContext, recordIndex) {
    test.serial(`API "/api/invite/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/invite/update/${inviteContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${inviteContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Invite was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, inviteContext, recordIndex) {
    test.serial(`API "/api/invite/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/invite/delete/${inviteContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${inviteContext.token}`
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
    test.serial(`API "/api/invite/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/invite/delete/${invalidId}`,
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
          t.true(result.message === 'Invalid invite id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteNotFoundId(fastify, test, testname, inviteContext, recordIndex) {
    test.serial(`API "/api/invite/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/invite/delete/${inviteContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${inviteContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Invite was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  accept(fastify, test, testname, userContext, inviteContext, recordIndex) {
    test.serial(`API "/api/invite/accept/:id" ${testname}`, async(t) => {
      const invite = inviteContext.records[recordIndex]
      await this.acceptApi(fastify, userContext.token, invite._id)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.inviter.toString() === inviteContext.records[recordIndex].inviter.toString())
          t.true(result.email === invite.email)
          t.true(result.type === invite.type)
          t.true(result.status === 'accepted')
          t.true(result.room._id.toString() === invite.room._id.toString())
          const userid = result.room[`${invite.type}s`].find(id => id.toString() === userContext.record._id.toString())
          t.true(!!userid)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  reject(fastify, test, testname, userContext, inviteContext, recordIndex) {
    test.serial(`API "/api/invite/reject/:id" ${testname}`, async(t) => {
      const invite = inviteContext.records[recordIndex]
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/invite/reject/${invite._id}`,
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
          t.true(result.inviter.toString() === inviteContext.records[recordIndex].inviter.toString())
          t.true(result.email === invite.email)
          t.true(result.type === invite.type)
          t.true(result.status === 'rejected')
          t.true(result.room._id.toString() === invite.room._id.toString())
          const userid = result.room[`${invite.type}s`].find(id => id.toString() === userContext.record._id.toString())
          t.true(!userid)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
}

module.exports = new InviteOps()
