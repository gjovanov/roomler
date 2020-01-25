const mongoose = require('mongoose')
const UserConnection = require('../../models/user-connection')
const UserConnectionFilter = require('./user-connection-filter')

class UserConnectionService {
  // base methods - START
  async get (filter) {
    const userFilter = new UserConnectionFilter({
      id: filter.id,
      conn_id: filter.conn_id
    })
      .getFilter()
    const record = await UserConnection
      .findOne(userFilter)
      .exec()
    return record
  }

  async create (userid, data) {
    if (userid) {
      data.user = mongoose.Types.ObjectId(userid)
    }
    let record = new UserConnection(data)
    record = await record.save()
    return record
  }

  async update (id, update) {
    const userFilter = new UserConnectionFilter({
      id
    })
      .getFilter()
    const options = {
      new: true
    }
    const record = await UserConnection
      .findOneAndUpdate(userFilter, update, options)
    return record
  }

  async delete (id) {
    const userFilter = new UserConnectionFilter({
      id
    })
      .getFilter()
    const result = await UserConnection
      .deleteOne(userFilter)
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

module.exports = new UserConnectionService()
