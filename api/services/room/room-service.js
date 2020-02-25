const Room = require('../../models/room')
const RoomFilter = require('./room-filter')
const slugify = require('slugify')
const slugOptions = {
  replacement: '-', // replace spaces with replacement
  remove: null, // regex to remove characters
  lower: true // result in lower case
}

class RoomService {
  slugify (data, parentRoom = null) {
    data.path = slugify(data.name, slugOptions)
    if (parentRoom && parentRoom.path) {
      data.path = `${parentRoom.path}.${data.path}`
    }
    if (parentRoom && parentRoom.name) {
      data.name = `${parentRoom.name}.${data.name}`
    }
  }

  recepients (rooms, users = []) {
    const userIds = users.map(u => u._id.toString())
    const roomUserIds = rooms.map(r => [r.owner.toString(), ...r.moderators.map(m => m.toString()), ...r.members.map(m => m.toString())]).reduce((a, b) => a.concat(b), [])
    return [...new Set([...userIds, ...roomUserIds])]
  }

  // base methods - START
  async get (userid, id, roles = ['owner', 'moderators', 'members']) {
    const roomFilter = new RoomFilter({
      id
    })
      .addUserFilter(userid, roles)
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
    const visibleChildrenRooms = await this.getVisibleChildren(records, userid)
    const result = records.concat(visibleChildrenRooms)
    return result
  }

  async getParent (room) {
    const parts = room.path.split('.')
    if (parts && parts.length) {
      parts.pop()
    }
    const parent = await Room.findOne({ path: parts.join('.') })
    return parent
  }

  async getChildren (room, userid) {
    const children = await Room.find({ path: new RegExp(`^${room.path}\\.`, 'i') })
    return children
  }

  async getVisibleChildren (records, userid) {
    const paths = records.map(r => new RegExp(`^${r.path}\\.`, 'i'))
    const additionalRecords = await Room.find({ $and: [{ path: { $in: paths } }, { $nor: [{ owner: userid }, { members: userid }, { moderators: userid }] }, { is_open: true }] })
    return additionalRecords
  }

  async create (userid, data) {
    data.owner = userid
    let record = new Room(data)
    record = await record.save()
    return record
  }

  async update (userid, id, update, roles = ['owner', 'moderators', 'members']) {
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
      .addUserFilter(userid, ['owner'])
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
    const result = await this.update(userid, id, update, ['owner', 'moderators', 'open', users])
    return result
  }

  async renameChildren (oldname, newname) {
    const oldpath = slugify(oldname, slugOptions)
    const newpath = slugify(newname, slugOptions)
    const options = {
      new: true
    }
    const result = await Room.updateMany(
      { path: new RegExp(`^${oldpath}\\.`, 'i') },
      [{
        $set: {
          path: {
            $concat: [
              { $arrayElemAt: [{ $split: ['$path', oldpath] }, 0] },
              newpath,
              { $arrayElemAt: [{ $split: ['$path', oldpath] }, 1] }
            ]
          },
          name: {
            $concat: [
              { $arrayElemAt: [{ $split: ['$name', oldname] }, 0] },
              newname,
              { $arrayElemAt: [{ $split: ['$name', oldname] }, 1] }
            ]
          }
        }
      }],
      options
    )
    return result
  }
}

module.exports = new RoomService()
