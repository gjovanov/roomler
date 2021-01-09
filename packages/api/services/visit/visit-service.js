const mongoose = require('mongoose')
const Visit = require('../../models/visit')
const VisitStatsFilter = require('./visit-stats-filter')

class VisitService {
  // base methods - START

  async getStats (filter) {
    const aggregate = new VisitStatsFilter(filter).getAggregate()
    let records = await Visit
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

  async open (id, data) {
    data.status = 'open'
    data.connection = mongoose.Types.ObjectId(id)
    let record = new Visit(data)
    record = await record.save()
      .then(r =>
        r.populate({
          path: 'connection',
          model: 'connections',
          populate: {
            path: 'user',
            model: 'users'
          }
        })
          .execPopulate())
    return record
  }

  async close (id) {
    const filter = {
      connection: mongoose.Types.ObjectId(id),
      status: 'open'
    }
    const update = {
      status: 'closed'
    }
    const options = {
      new: true
    }
    const records = await Visit
      .updateMany(filter, update, options)
    return records
  }
}

module.exports = new VisitService()
