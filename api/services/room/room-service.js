const Room = require('../../models/room')
const RoomFilter = require('./room-filter')
const slugify = require('slugify')
const slugOptions = {
  replacement: '-', // replace spaces with replacement
  remove: null, // regex to remove characters
  lower: true // result in lower case
}

class RoomService {
  recepients (rooms, users = []) {
    const userIds = users.map(u => u._id.toString())
    const roomUserIds = rooms.map(r => [r.owner.toString(), ...r.moderators.map(m => m.toString()), ...r.members.map(m => m.toString())]).reduce((a, b) => a.concat(b), [])
    return [...new Set([...userIds, ...roomUserIds])]
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
    return record
  }

  async getAll (userid, page = 0, size = 100, filter = {}, sort = {
    path: 'asc'
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
      .sort(sort)
      .skip(pageInt * sizeInt)
      .limit(sizeInt)
      .exec()
    const paths = records.map(r => new RegExp(`^${r.path}.`, 'i'))
    const additionalRecords = await Room.find({ $and: [{ path: { $in: paths } }, { $nor: [{ owner: userid }, { members: userid }, { moderators: userid }] }, { is_open: true }] })
    const result = records.concat(additionalRecords)
    return result
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
    return record
  }

  async update (userid, id, update, roles = ['owner', 'moderators', 'members']) {
    if (update.name) {
      update.path = slugify(update.name, slugOptions)
    }
    const roomFilter = new RoomFilter({
      id
    })
      .addUserFilter(userid, roles)
      .getFilter()
    const options = {
      new: true
    }
    const record = await Room
      .findOneAndUpdate(roomFilter, update, options)
    if (!record) {
      throw new ReferenceError('Room was not found.')
    }
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
    if (!result.deletedCount) {
      throw new ReferenceError('Room was not found.')
    }
    return result
  }
  // base methods - END

  async transfer (userid, id, payload) {
    const user = payload.user
    let update = {
      owner: user,
      $pull: {
        moderators: user,
        members: user
      }
    }
    await this.update(userid, id, update, ['owner'])
    update = {
      $addToSet: {
        moderators: userid
      }
    }
    const result = await this.update(user, id, update, ['owner'])
    return result
  }

  async switch (userid, id, type, payload) {
    const fromType = type === 'members' ? 'moderators' : 'members'
    const user = payload.user
    const update = {
      $pull: { },
      $addToSet: { }
    }
    update.$pull[fromType] = user
    update.$addToSet[type] = user
    const roles = ['owner']
    if (type === 'moderators') {
      roles.push('moderators') // moderator can promote another user to moderator, only owner can demote another user to member
    }
    const result = await this.update(userid, id, update, roles)
    return result
  }

  async updateList (userid, id, type, payload) {
    const users = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const update = {
      $set: {}
    }
    update.$set[type] = users
    const result = await this.update(userid, id, update, ['owner', 'moderators'])
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
    const result = await this.update(userid, id, update, ['owner', 'moderators', 'open'])
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
    const result = await this.update(userid, id, update, ['owner', 'moderators', 'open'])
    return result
  }
}

module.exports = new RoomService()
