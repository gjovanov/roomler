const mongoose = require('mongoose')
const Message = require('../../models/message')
const MessageFilter = require('./message-filter')
const extendRecord = (record, userid, convertToObject = true) => {
  const recordObj = convertToObject ? record.toObject() : record
  recordObj.is_read = !!record.readby.find(u => u._id.toString() === userid.toString())
  recordObj.has_mention = !!record.mentions.find(u => u._id.toString() === userid.toString())
  recordObj.has_reaction = !!record.reactions.find(u => u.user._id.toString() === userid.toString())
  return recordObj
}

class MessageService {
  recepients (messages) {
    return messages.map(m => [m.room.owner, ...m.room.moderators, ...m.room.members]).reduce((a, b) => a.concat(b), [])
  }

  route (messages, userid) {
    const useridString = JSON.stringify(userid)
    return messages
      .filter((message) => {
        return JSON.stringify(message.room.owner) === useridString ||
          message.room.moderators.map(u => JSON.stringify(u)).includes(useridString) ||
          message.room.members.map(u => JSON.stringify(u)).includes(useridString)
      })
      .map((message) => {
        return extendRecord(message, userid, false)
      })
  }

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
        record.reactions.forEach((reaction) => {
          const user = record.reactions_users.find(u => u._id.toString() === reaction.user.toString())
          reaction.user = user
        })
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
      record.reactions.forEach((reaction) => {
        const user = record.reactions_users.find(u => u._id.toString() === reaction.user.toString())
        reaction.user = user
      })
      return record
    })
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

  async update (userid, id, update, validate = true) {
    const options = {
      new: true
    }
    const messageFilter = new MessageFilter({
      id
    })
    let records = []
    if (validate) {
      const aggregate = messageFilter
        .addLookup()
        .addMatch(userid)
        .getAggregate()
      records = await Message
        .aggregate(aggregate)
        .exec()
    }
    if (validate) {
      if (!records.length) {
        throw new ReferenceError('Message was not found.')
      }
    }
    const record = await Message.findOneAndUpdate(messageFilter.getFilter(), update, options)
      .populate('author')
      .populate('room')
      .populate('readby')
      .populate('mentions')
      .populate('reactions.user')

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
      name: payload.name,
      symbol: payload.symbol
    }
    const updatePull = {
      $pull: {
        reactions: {
          user: userid
        }
      }
    }
    await this.update(userid, id, updatePull, false)
    const updatePush = {
      $addToSet: {
        reactions: reaction
      }
    }
    const result = await this.update(userid, id, updatePush)
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
