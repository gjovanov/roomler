const Room = require('../../models/room')
const RoomFilter = require('./room-filter')

class RoomService {
  // base methods - START
  async get (userid, id) {
    const roomFilter = new RoomFilter({
      id
    })
      .addUserFilter(userid)
      .getFilter()
    const record = await Room
      .findOne(roomFilter)
      .populate('owner')
      .populate('moderators')
      .populate('members')
      .exec()
    return record
  }

  async getAll (userid, page = 0, size = 10, filter = {
    _id: {
      $exists: true
    }
  }, sort = {
    createdAt: 'desc'
  }) {
    const roomFilter = new RoomFilter({
      filter
    })
      .addUserFilter(userid)
      .getFilter()
    const pageInt = parseInt(page)
    const sizeInt = parseInt(size)
    const records = await Room
      .find(roomFilter)
      .populate('owner')
      .populate('moderators')
      .populate('members')
      .sort(sort)
      .skip(pageInt * sizeInt)
      .limit(sizeInt)
      .exec()
    return records
  }

  async create (userid, data) {
    data.owner = userid
    let record = new Room(data)
    record = await record.save()
      .then(r =>
        r.populate('owner')
          .populate('moderators')
          .populate('members')
          .execPopulate())
    return record
  }

  async update (userid, id, update, filterOptions = {
    userFilter: true
  }) {
    const roomFilter = new RoomFilter({
      id
    })
      .addUserFilter(userid)
      .getFilter()
    const options = {
      new: true
    }
    const record = await Room
      .findOneAndUpdate(roomFilter, update, options)
      .populate('owner')
      .populate('moderators')
      .populate('members')
    return record
  }

  async delete (userid, id) {
    const roomFilter = new RoomFilter({
      id
    })
      .addUserFilter(userid)
      .getFilter()
    const result = await Room
      .deleteOne(roomFilter)
      .exec()
    return result
  }
  // base methods - END

  async updateList (userid, type, payload) {
    const users = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const update = {
      $set: {}
    }
    update.$set[type] = users
    const result = await this.update(userid, payload.id, update)
    return result
  }

  async push (userid, type, payload) {
    const users = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const update = {
      $addToSet: {}
    }
    update.$addToSet[type] = {
      $each: users
    }
    const result = await this.update(userid, payload.id, update)
    return result
  }

  async pull (userid, type, payload) {
    const users = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const update = {
      $pull: {}
    }
    update.$pull[type] = {
      $in: users
    }
    const result = await this.update(userid, payload.id, update)
    return result
  }
}

module.exports = new RoomService()
