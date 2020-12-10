const mongoose = require('mongoose')
const Message = require('../../models/message')
const MessageFilter = require('./message-filter')
const extendRecord = (record, userid, convertToObject = true) => {
  const recordObj = convertToObject ? record.toObject() : record
  recordObj.is_read = !!record.readby.find(u => u.toString() === userid.toString())
  recordObj.has_mention = !!record.mentions.find(u => u.toString() === userid.toString())
  recordObj.has_reaction = !!record.reactions.find(u => u.user.toString() === userid.toString())
  return recordObj
}

class MessageService {
  recepients (messages) {
    return [...new Set(messages.map(m => [m.room.owner.toString(), ...m.room.moderators.map(u => u.toString()), ...m.room.members.map(u => u.toString())]).reduce((a, b) => a.concat(b), []))]
  }

  extension (record, userid) {
    const id = JSON.stringify(userid)
    record.is_read = !!record.readby.find(u => JSON.stringify(u) === id)
    record.has_mention = !!record.mentions.find(u => JSON.stringify(u) === id)
    record.has_reaction = !!record.reactions.find(u => JSON.stringify(u.user) === id)
    return record
  }

  // base methods - START
  async get (userid, id) {
    const messageFilter = new MessageFilter({
      id
    })
    const aggregate = messageFilter
      .addPreMatch()
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
        record.room = record.room[0]
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
      .addPreMatch()
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
      record.room = record.room[0]
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
            .populate('room')
            .execPopulate()
          const result = extendRecord(record, userid)
          return result
        }))
      })
    return records
  }

  async update (userid, id, update, validate = true) {
    const skipPull = JSON.stringify(update).includes('readby')
    if (!skipPull) {
      if (!update.$pull) {
        update.$pull = {}
      }
      if (!update.$pull.readby) {
        update.$pull.readby = { $ne: userid }
      }
    }

    const options = {
      new: true
    }
    const messageFilter = new MessageFilter({
      id
    })
    let records = []
    if (validate) {
      const aggregate = messageFilter
        .addPreMatch()
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
      .populate('room')

    return extendRecord(record, userid)
  }

  async delete (userid, id) {
    const messageFilter = new MessageFilter({
      id
    })
    const aggregate = messageFilter
      .addPreMatch()
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
