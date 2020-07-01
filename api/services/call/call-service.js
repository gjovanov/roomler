const mongoose = require('mongoose')
const Call = require('../../models/call')
const CallFilter = require('./call-filter')

class CallService {
  // base methods - START

  async getAll (filter) {
    const callFilter = new CallFilter({
      id: filter.id,
      ids: filter.ids,
      call_id: filter.call_id,
      status: filter.status
    })
      .getFilter()
    const record = await Call
      .find(callFilter)
      .exec()
    return record
  }

  async create (userid, data) {
    data.room = mongoose.Types.ObjectId(data.room)
    if (userid) {
      data.user = mongoose.Types.ObjectId(userid)
    }
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

  async close (id) {
    const update = {
      status: 'closed'
    }
    const result = await this.update(id, update)
    return result
  }
}

module.exports = new CallService()
