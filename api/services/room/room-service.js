const slugify = require('slugify')
const Room = require('../../models/room')
const RoomFilter = require('./room-filter')
const slugOptions = {
  replacement: '-', // replace spaces with replacement
  remove: null, // regex to remove characters
  lower: true // result in lower case
}
const extendRole = (record) => {
  const recordObj = record.toObject()
  // recordObj.owner.role = 'owner'
  // recordObj.moderators.forEach((m) => {
  //   m.role = 'moderator'
  // })
  // recordObj.members.forEach((m) => {
  //   m.role = 'member'
  // })
  return recordObj
}
class RoomService {
  recepients (rooms) {
    return rooms.map(r => [r.owner, ...r.moderators, ...r.members]).reduce((a, b) => a.concat(b), [])
  }

  // base methods - START
  async get (userid, id) {
    const roomFilter = new RoomFilter({
      id
    })
      .addUserFilter(userid)
      .getFilter()
    const record = await Room
      .findOne(roomFilter)
      .exec()
    if (!record) {
      throw new ReferenceError('Room was not found.')
    }
    return extendRole(record)
  }

  async getAll (userid, page = 0, size = 10, filter = {}, sort = {
    path: 'asc'
  }) {
    const roomFilter = new RoomFilter({
      filter
    })
      .addUserFilter(userid)
      .getFilter()
    console.log(JSON.stringify(roomFilter))
    const pageInt = parseInt(page)
    const sizeInt = parseInt(size)
    const records = await Room
      .find(roomFilter)
      .sort(sort)
      .skip(pageInt * sizeInt)
      .limit(sizeInt)
      .exec()
    return records.map(record => extendRole(record))
  }

  async create (userid, data) {
    data.owner = userid
    data.path = slugify(data.name, slugOptions)
    if (data.parent_path) {
      data.path = `${data.parent_path}.${data.path}`
    }
    if (data.parent_name) {
      data.name = `${data.parent_name}.${data.name}`
    }
    let record = new Room(data)
    record = await record.save()
    return extendRole(record)
  }

  async update (userid, id, update) {
    if (update.name) {
      update.path = slugify(update.name, slugOptions)
    }
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
    if (!record) {
      throw new ReferenceError('Room was not found.')
    }
    return extendRole(record)
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
    if (!result.deletedCount) {
      throw new ReferenceError('Room was not found.')
    }
    return result
  }
  // base methods - END

  async updateList (userid, id, type, payload) {
    const users = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const update = {
      $set: {}
    }
    update.$set[type] = users
    const result = await this.update(userid, id, update)
    return result
  }

  async push (userid, id, type, payload) {
    const users = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const update = {
      $addToSet: {}
    }
    update.$addToSet[type] = {
      $each: users
    }
    const result = await this.update(userid, id, update)
    return result
  }

  async pull (userid, id, type, payload) {
    const users = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const update = {
      $pull: {}
    }
    update.$pull[type] = {
      $in: users
    }
    const result = await this.update(userid, id, update)
    return result
  }
}

module.exports = new RoomService()
