const mongoose = require('mongoose')
const Visit = require('../../models/visit')

class VisitService {
  // base methods - START

  async getAll (filter, page = 0, size = 100) {
    const $match = { $and: [] }
    if (filter.from) {
      $match.$and.push({ $gte: { createdAt: new Date(filter.from) } })
    }
    if (filter.to) {
      $match.$and.push({ $gte: { createdAt: new Date(filter.to) } })
    }
    if (filter.status) {
      $match.$and.push({ status: filter.status })
    }
    if (filter.user) {
      $match.$and.push({ 'connection.user._id': mongoose.Types.ObjectId(filter.user) })
    }
    if (filter.os) {
      $match.$and.push({ 'connection.os.name': filter.os })
    }
    if (filter.browser) {
      $match.$and.push({ 'connection.browser.name': filter.browser })
    }
    if (filter.country) {
      $match.$and.push({ 'connection.geoip.code': filter.country })
    }
    const records = await Visit
      .aggregate([
        {
          $lookup: {
            from: 'connections',
            let: { connectionId: '$connection' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$connectionId'] } } },
              {
                $lookup: {
                  from: 'users',
                  let: { userId: '$user' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$userId'] } } }
                  ],
                  as: 'user'
                }
              },
              { $unwind: '$user' }
            ],
            as: 'connection'
          }
        },
        { $unwind: '$connection' },
        { $match },
        { $skip: page * size },
        { $limit: size },
        { $sort: { createdAt: -1 } }
      ])
      .allowDiskUse(true)
      .exec()

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
