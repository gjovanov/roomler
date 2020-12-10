const mongoose = require('mongoose')
const Call = require('../../models/call')
const CallFilter = require('./call-filter')
const CallStatsFilter = require('./call-stats-filter')

class CallService {
  // base methods - START

  async getAll (filter) {
    const callFilter = new CallFilter({
      id: filter.id,
      ids: filter.ids,
      connection: filter.connection,
      call_id: filter.call_id,
      status: filter.status
    })
      .getFilter()
    const record = await Call
      .find(callFilter)
      .exec()
    return record
  }

  async getStats (filter, group) {
    const aggregate = new CallStatsFilter(filter).getAggregate()
    let records = await Call
      .aggregate(aggregate)
      .collation({ locale: 'en', strength: 2 })
      .allowDiskUse(true)
      .exec()
    records = records.map((r) => {
      r.count = r.count && r.count.length ? r.count[0].count : 0
      return r
    })[0]
    return records
  }

  async create (userid, data) {
    data.room = mongoose.Types.ObjectId(data.room)
    if (userid) {
      data.user = mongoose.Types.ObjectId(userid)
    }
    let record = new Call(data)
    record = await record.save()
      .then(r =>
        r.populate({ path: 'userObj', select: '_id username' })
          .execPopulate())
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
      .populate({ path: 'userObj', select: '_id username' })
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
