const mongoose = require('mongoose')
class MessageFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        throw new TypeError('Invalid message id!')
      }
    }
    if (this.filter.room) {
      const roomid = this.filter.room
      delete this.filter.room
      this.filter.room = mongoose.Types.ObjectId(roomid)
    }
    this.aggregate = []
  }

  addPreMatch () {
    const before = this.filter.before
    delete this.filter.before
    const match = {
      $match: this.filter
    }
    if (before) {
      match.$match.createdAt = { $lt: new Date(before) }
    }
    this.aggregate.push(match)
    return this
  }

  addLookup () {
    this.aggregate.push({
      $lookup: {
        from: 'rooms',
        localField: 'room',
        foreignField: '_id',
        as: 'room'
      }
    })
    return this
  }

  addMatch (userid) {
    const match = {
      $match: {
        $or: [{
          'room.owner': mongoose.Types.ObjectId(userid)
        },
        {
          'room.moderators': mongoose.Types.ObjectId(userid)
        },
        {
          'room.members': mongoose.Types.ObjectId(userid)
        }
        ]
      }
    }
    this.aggregate.push(match)
    return this
  }

  addSort ($sort) {
    this.aggregate.push({
      $sort
    })
    return this
  }

  addSkip ($skip) {
    this.aggregate.push({
      $skip
    })
    return this
  }

  addLimit ($limit) {
    this.aggregate.push({
      $limit
    })
    return this
  }

  getFilter () {
    return this.filter
  }

  getAggregate () {
    return this.aggregate
  }
}

module.exports = MessageFilter
