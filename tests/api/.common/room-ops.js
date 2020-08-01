class RoomOps {
  async createApi(fastify, token, payload) {
    const result = await fastify
        .inject({
          method: 'POST',
          url: `/api/room/create`,
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
          url: `/api/room/update/${roomid}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          payload
        })
    return result
  }

  async pushApi(fastify, token, roomid, type, payload) {
    const result = await fastify
        .inject({
          method: 'PUT',
          url: `/api/room/${type}s/push/${roomid}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          payload
        })
      return result
  }

  async pullApi(fastify, token, roomid, type, payload) {
    const result = await fastify
        .inject({
          method: 'PUT',
          url: `/api/room/${type}s/pull/${roomid}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          payload
        })
    return result
  }

  async deleteApi(fastify, token, roomid) {
    const result = await fastify
        .inject({
          method: 'DELETE',
          url: `/api/room/delete/${roomid}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
    return result
  }

  create(fastify, test, testname, context) {
    test.serial(`API "/api/room/create" ${testname}`, async(t) => {
      await this.createApi(fastify, context.token, context.payload)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result._id)
          t.true(result.name === context.payload.name)
          if (context.payload.tags) {
            context.payload.tags.forEach(tag => {
              t.true(result.tags.includes(tag))
            })
          }
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          context.record = result
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  get(fastify, test, testname, roomContext) {
    test.serial(`API "/api/room/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/room/get?id=${roomContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${roomContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result._id)
          t.true(result.name === roomContext.payload.name)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          roomContext.record = result
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/room/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/room/get?id=${invalidId}`,
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
          t.true(result.message === 'Invalid room id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getNotFoundId(fastify, test, testname, roomContext) {
    test.serial(`API "/api/room/get" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/room/get?id=${roomContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${roomContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Room was not found or you don\'t have access to it.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getAll(fastify, test, testname, roomContexts) {
    test.serial(`API "/api/room/get-all" ${testname}`, async(t) => {
      const expectedRooms = roomContexts.map(ec => ec.record)
      await fastify
        .inject({
          method: 'GET',
          url: `/api/room/get-all`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${roomContexts[0].token}`
          },
          payload: roomContexts.payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result.rooms))
          t.true(Array.isArray(result.messages))
          expectedRooms.forEach(expectedRoom => {
            const room = result.rooms.find(r => r._id.toString() === expectedRoom._id.toString())
            t.true(!!room)
            t.true(expectedRoom._id.toString() === room._id.toString())
            t.true(expectedRoom.name === room.name)
            t.true(!!expectedRoom.createdAt)
            t.true(!!expectedRoom.updatedAt)
          })
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getPeers(fastify, test, testname, roomContexts) {
    test.serial(`API "/api/auth/get-peers" ${testname}`, async(t) => {
      const expectedRooms = roomContexts.map(ec => ec.record)
      await fastify
        .inject({
          method: 'GET',
          url: `/api/auth/get-peers`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${roomContexts[0].token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          // t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          // const result = JSON.parse(response.payload)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  update(fastify, test, testname, roomContext) {
    test.serial(`API "/api/room/update/:id" ${testname}`, async(t) => {
      const payload = roomContext.update
      await this.updateApi(fastify, roomContext.token, roomContext.record._id, payload)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result.room)
          t.true(!!result.room._id)
          t.true(result.room.name === roomContext.update.name)
          if (roomContext.update.tags) {
            roomContext.update.tags.forEach(tag => {
              t.true(result.room.tags.includes(tag))
            })
          }
          t.true(!!result.room.createdAt)
          t.true(!!result.room.updatedAt)
          roomContext.record = result.room
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  updateInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/room/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/room/update/${invalidId}`,
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
          t.true(result.message === 'Invalid room id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
  updateNotFoundId(fastify, test, testname, roomContext) {
    test.serial(`API "/api/room/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/room/update/${roomContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${roomContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Room was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, context, userContext) {
    test.serial(`API "/api/room/delete/:id" ${testname}`, async(t) => {
      await this.deleteApi(fastify, userContext.token, context.record._id)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result.room)
          t.true(!!result.result)
          t.true(result.result.ok === 1)
          t.true(result.result.n > 0)
          t.true(result.result.deletedCount > 0)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/room/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/room/delete/${invalidId}`,
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
          t.true(result.message === 'Invalid room id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteNotFoundId(fastify, test, testname, roomContext) {
    test.serial(`API "/api/room/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/room/delete/${roomContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${roomContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Room was not found or you don\'t have access to it.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  transfer(fastify, test, testname, roomContext, userContext) {
    test.serial(`API "/api/room/owner/transfer/:id" ${testname}`, async(t) => {
      const payload = {}
      payload.user = userContext && userContext.record && userContext.record._id ? userContext.record._id : null
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/room/owner/transfer/${roomContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${roomContext.token}`
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const payload = JSON.parse(response.payload)
          const result = payload.room
          t.true(!!result._id)
          t.true(result.name === roomContext.record.name)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          t.true(result.owner.toString() === userContext.record._id)
          const moderators = result.moderators
          t.true(Array.isArray(moderators))
          const found = moderators.find(moderator => roomContext.userContext.record._id.toString() === moderator.toString())
          t.true(!!found)
          roomContext.userContext = userContext
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  switch(fastify, test, testname, type, roomContext, authContext, userContext) {
    test.serial(`API "/api/room/${type}/switch/:id" ${testname}`, async(t) => {
      const payload = {}
      payload.user = userContext && userContext.record && userContext.record._id ? userContext.record._id : null
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/room/${type}/switch/${roomContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authContext.token}`
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const payload = JSON.parse(response.payload)
          const result = payload.room
          t.true(!!result._id)
          t.true(result.name === roomContext.record.name)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          const fromType = type === 'members' ? 'moderators' : 'members'
          const fromArray = result[fromType]
          t.true(Array.isArray(fromArray))
          const notFound = fromArray.find(user => userContext.record._id.toString() === user.toString())
          t.true(!notFound)
          const toArray = result[type]
          t.true(Array.isArray(toArray))
          const found = toArray.find(user => userContext.record._id.toString() === user.toString())
          t.true(!!found)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  push(fastify, test, testname, arrayType, roomContext, userContexts) {
    test.serial(`API "/api/room/${arrayType}s/push/:id" ${testname}`, async(t) => {
      const payload = {}
      if (Array.isArray(userContexts)) {
        payload.users = userContexts.map(uc => uc.record._id)
      } else {
        payload.user = userContexts && userContexts.record && userContexts.record._id ? userContexts.record._id : null
      }
      await this.pushApi(fastify, roomContext.token, roomContext.record._id, arrayType, payload)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const payload = JSON.parse(response.payload)
          const result = payload.room
          t.true(!!result._id)
          t.true(result.name === roomContext.record.name)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          const array = result[`${arrayType}s`]
          t.true(Array.isArray(array))
          const users = Array.isArray(userContexts) ? userContexts : (userContexts ? [userContexts] : [])
          users.forEach(user => {
            const arrayItem = array.find(item => item.toString() === user.record._id.toString())
            t.true(!!arrayItem)
          })
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  pull(fastify, test, testname, arrayType, roomContext, userContexts) {
    test.serial(`API "/api/room/${arrayType}s/pull/:id" ${testname}`, async(t) => {
      const payload = {}
      if (Array.isArray(userContexts)) {
        payload.users = userContexts.map(uc => uc.record._id)
      } else {
        payload.user = userContexts && userContexts.record && userContexts.record._id ? userContexts.record._id : null
      }
      await this.pullApi(fastify, roomContext.token, roomContext.record._id, arrayType, payload)
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const payload = JSON.parse(response.payload)
          const result = payload.room
          t.true(!!result._id)
          t.true(result.name === roomContext.record.name)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          const array = result[`${arrayType}s`]
          t.true(Array.isArray(array))

          const users = Array.isArray(userContexts) ? userContexts : (userContexts ? [userContexts] : [])
          users.forEach(user => {
            const arrayItem = array.find(item => item.toString() === user.record._id.toString())
            t.true(!arrayItem)
          })
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  updateList(fastify, test, testname, arrayType, roomContext, userContexts) {
    test.serial(`API "/api/room/${arrayType}s/update/:id" ${testname}`, async(t) => {
      const payload = {}
      if (Array.isArray(userContexts)) {
        payload.users = userContexts.map(uc => uc.record._id)
      } else {
        payload.user = userContexts && userContexts.record && userContexts.record._id ? userContexts.record._id : null
      }
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/room/${arrayType}s/update/${roomContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${roomContext.token}`
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const payload = JSON.parse(response.payload)
          const result = payload.room
          t.true(!!result._id)
          t.true(result.name === roomContext.record.name)
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          const array = result[`${arrayType}s`]
          t.true(Array.isArray(array))
          const users = Array.isArray(userContexts) ? userContexts : (userContexts ? [userContexts] : [])
          t.true(array.length === users.length)
          users.forEach(user => {
            const arrayItem = array.find(item => item.toString() === user.record._id.toString())
            t.true(!!arrayItem)
          })
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
}

module.exports = new RoomOps()
