const Call = require('../../models/call')
const CallFilter = require('./call-filter')
const CallUserFilter = require('./call-user-filter')
const mongoose = require('mongoose')

class CallService {
  // base methods - START
  async get (filter) {
    const callFilter = new CallFilter({
      id: filter.id
    })
      .getFilter()
    const record = await Call
      .findOne(callFilter)
      .exec()
    return record
  }

  async getAll (user, room, status = 'open') {
    const callUserFilter = new CallUserFilter({
      user,
      room,
      status
    })
      .getFilter()
    const record = await Call
      .find(callUserFilter)
      .exec()
    return record
  }

  async create (userid, data) {
    if (userid) {
      data.user = mongoose.Types.ObjectId(userid)
    }
    data.started = new Date()
    let record = new Call(data)
    record = await record.save()
    return record
  }

  async update (id, update) {
    const callFilter = new CallFilter({
      id
    })
      .getFilter()
    const options = {
      new: true
    }
    const record = await Call
      .findOneAndUpdate(callFilter, update, options)
    return record
  }

  async delete (id) {
    const callFilter = new CallFilter({
      id
    })
      .getFilter()
    const result = await Call
      .deleteOne(callFilter)
      .exec()
    return result
  }

  async close (id) {
    const update = {
      status: 'closed',
      ended: new Date()
    }
    const result = await this.update(id, update)
    return result
  }

  async closeAll (ids) {
    const result = await Promise.all(ids.map(id => this.close(id)))
    return result
  }
}

module.exports = new CallService()
