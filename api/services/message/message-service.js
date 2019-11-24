const mongoose = require('mongoose')
const Message = require('../../models/message')
const MessageFilter = require('./message-filter')
const extendRecord = (record, userid, convertToObject = true) => {
  const recordObj = convertToObject ? record.toObject() : record
  recordObj.is_read = !!record.readby.find(u => u._id.toString() === userid.toString())
  recordObj.has_mention = !!record.mentions.find(u => u._id.toString() === userid.toString())
  return recordObj
}

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
        const record = extendRecord(records[0], userid, false)
        record.author = record.author[0]
        record.room = record.room[0]
        if (record.reactions && record.reactions.length) {
          record.reactions.forEach((reaction) => {
            reaction.user = reaction.user[0]
          })
        }
        return record
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

    let records = await Message
      .aggregate(aggregate)
      .exec()
    records = records.map((r) => {
      const record = extendRecord(r, userid, false)
      record.author = record.author[0]
      record.room = record.room[0]
      if (record.reactions && record.reactions.length &&
          record.reactions_users && record.reactions_users.length) {
        record.reactions.forEach((reaction) => {
          const user = record.reactions_users.find(u => u._id.toString() === reaction.user.toString())
          if (user) {
            reaction.user = user
          }
        })
      }
      return record
    })
    console.log(records[0].reactions)
    return records.reverse()
  }

  async create (userid, payload) {
    const messages = Array.isArray(payload.message) ? payload.message : (payload.message ? [payload.message] : [])
    messages.forEach((message) => {
      message.room = mongoose.Types.ObjectId(payload.room)
      message.author = mongoose.Types.ObjectId(userid)
      message.readby = [mongoose.Types.ObjectId(userid)]
    })
    const records = await Message
      .insertMany(messages)
      .then((rows) => {
        return Promise.all(rows.map(async (row) => {
          const record = await row
            .populate('author')
            .populate('room')
            .populate('readby')
            .populate('mentions')
            .populate('reactions.user')
            .execPopulate()
          return extendRecord(record, userid)
        }))
      })

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
          .populate('author')
          .populate('room')
          .populate('readby')
          .populate('mentions')
          .populate('reactions.user')
      })

    return extendRecord(record, userid)
  }

  async delete (userid, id) {
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
        return Message.deleteOne(messageFilter.getFilter()).exec()
      })
    return record
  }
  // base methods - END

  async pushReadby (userid, id) {
    const update = {
      $addToSet: {
        readby: userid
      }
    }
    const result = await this.update(userid, id, update)
    return result
  }

  async pushAllReadby (userid, ids) {
    const update = {
      $addToSet: {
        readby: userid
      }
    }
    const result = await Promise.all(ids.map(id => this.update(userid, id, update)))
    return result
  }

  async pullReadby (userid, id) {
    const update = {
      $pull: {
        readby: userid
      }
    }
    const result = await this.update(userid, id, update)
    return result
  }

  async pushReaction (userid, id, payload) {
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
    const result = await this.update(userid, id, update)
    return result
  }

  async pullReaction (userid, id) {
    const update = {
      $pull: {
        reactions: {
          user: userid
        }
      }
    }
    const result = await this.update(userid, id, update)
    return result
  }
}

module.exports = new MessageService()
