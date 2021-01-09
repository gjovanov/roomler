class CallOps {
  async getAllApi (fastify, token) {
    const result = await fastify
        .inject({
        method: 'GET',
        url: `/api/room/calls/get-all`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        payload: {}
    })
    return result
  }

  async pullApi (fastify, token, id) {
    const result = await fastify
        .inject({
        method: 'POST',
        url: `/api/room/calls/pull/${id}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        payload: {}
    })
    return result
  }
}

module.exports = new CallOps()
