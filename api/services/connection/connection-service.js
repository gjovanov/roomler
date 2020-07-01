const mongoose = require('mongoose')
const Connection = require('../../models/connection')
const ConnectionFilter = require('./connection-filter')

class ConnectionService {
  // base methods - START
  async create (userid, data) {
    if (userid) {
      data.user = mongoose.Types.ObjectId(userid)
    }
    let record = new Connection(data)
    record = await record.save()
    return record
  }

  async update (id, update) {
    const connectionFilter = new ConnectionFilter({
      id
    })
      .getFilter()
    const options = {
      new: true
    }
    const record = await Connection
      .findOneAndUpdate(connectionFilter, update, options)
    return record
  }

  async delete (id) {
    const connectionFilter = new ConnectionFilter({
      id
    })
      .getFilter()
    const result = await Connection
      .deleteOne(connectionFilter)
      .exec()
    return result
  }

  async close (id) {
    const update = {
      status: 'closed'
    }
    const result = await this.update(id, update)
    return result
  }
}

module.exports = new ConnectionService()
