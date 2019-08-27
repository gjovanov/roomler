class RoomOps {
  create(fastify, test, testname, context) {
    test.serial(`API "/api/room/create" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'POST',
          url: `/api/room/create`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.token}`
          },
          payload: context.payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result._id !== undefined)
          t.true(result.name === context.payload.name)
          t.true(result.createdAt !== undefined)
          t.true(result.updatedAt !== undefined)
          context.record = result
          t.pass()
        })
        .catch(() => {
          t.fail()
        })
    })
  }

  delete(fastify, test, testname, context) {
    test.serial(`API "/api/room/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/room/delete/${context.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.token}`
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
        .catch(() => {
          t.fail()
        })
    })
  }

}

module.exports = new RoomOps()
