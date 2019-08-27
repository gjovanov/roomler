const mongoose = require('mongoose')
const Message = require('../../models/message')
const MessageFilter = require('./message-filter')

class MessageService {
  // base methods - START
  async get (userid, id) {
    const messageFilter = new MessageFilter({
      id
    })
    const aggregate = messageFilter
      .addLookup()
      .addMatch(userid)
      .getAggregate()
    const record = await Message
      .aggregate(aggregate)
      .exec()
      .then((records) => {
        if (!records.length) {
          throw new ReferenceError('Message was not found.')
        }
        records[0].author = records[0].author[0]
        records[0].room = records[0].room[0]
        return records[0]
      })
    return record
  }

  async getAll (userid, page = 0, size = 10, filter = {}, sort = {
    createdAt: -1
  }) {
    const pageInt = parseInt(page)
    const sizeInt = parseInt(size)
    const messageFilter = new MessageFilter({
      filter
    })
    const aggregate = messageFilter
      .addLookup()
      .addMatch(userid)
      .addSort(sort)
      .addSkip(pageInt * sizeInt)
      .addLimit(sizeInt)
      .getAggregate()

    const records = await Message
      .aggregate(aggregate)
      .exec()
    records.forEach((record) => {
      record.room = record.room[0]
    })
    return records
  }

  async create (user, items) {
    items.forEach((item) => {
      item.inviter = mongoose.Types.ObjectId(user._id)
    })
    const records = await Message
      .insertMany(items)

    return records
  }

  async update (userid, id, update) {
    const options = {
      new: true
    }
    const messageFilter = new MessageFilter({
      id
    })
    const aggregate = messageFilter
      .addLookup()
      .addMatch(userid)
      .getAggregate()
    const record = await Message
      .aggregate(aggregate)
      .exec()
      .then((records) => {
        if (!records.length) {
          throw new ReferenceError('Message was not found.')
        }
        return Message.findOneAndUpdate(messageFilter.getFilter(), update, options)
          .populate('room')
      })

    return record
  }

  async delete (userid, id) {
    const messageFilter = new MessageFilter({
      id
    })
    const aggregate = messageFilter
      .addLookup()
      .addMatch(userid)
      .getFilter()
    const record = await Message
      .aggregate(aggregate)
      .exec()
      .then((records) => {
        if (!records.length) {
          throw new ReferenceError('Message was not found.')
        }
        return Message.deleteOne(messageFilter.getFilter()).exec()
      })
    return record
  }
  // base methods - END

  async push (userid, payload) {
    const reaction = {
      user: userid,
      type: payload.type,
      reaction: payload.reaction
    }
    const update = {
      $addToSet: {
        reactions: reaction
      }
    }
    const result = await this.update(userid, payload.id, update)
    return result
  }

  async pull (userid, payload) {
    const update = {
      $pull: {
        reactions: {
          _id: userid
        }
      }
    }
    const result = await this.update(userid, payload.id, update)
    return result
  }
}

module.exports = new MessageService()
