const slugify = require('slugify')
const config = require('../../../config')
const Room = require('../../models/room')
const RoomFilter = require('./room-filter')
const RoomExploreFilter = require('./room-explore-filter')
const RoomRenameFilter = require('./room-rename-filter')
const RoomChildrenFilter = require('./room-children-filter')
const RoomDeleteFilter = require('./room-delete-filter')
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
  async get (userid, query, roles = ['owner', 'moderators', 'members', 'open']) {
    const roomFilter = new RoomFilter({
      id: query.id,
      query: query.query
    })
      .addUserFilter(userid, roles)
      .getFilter()
    const record = await Room
      .findOne(roomFilter)
      .exec()
    if (!record) {
      throw new ReferenceError('Room was not found or you don\'t have access to it.')
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

  async explore (search = null, page = 0, size = 10) {
    const roomExploreFilter = new RoomExploreFilter(search, page, size)
      .getFilter()
    const records = await Room
      .aggregate(roomExploreFilter)
      .collation({ locale: 'en', strength: 2 })
    return records.map((r) => {
      r.count = r.count && r.count.length ? r.count[0].count : 0
      return r
    })[0]
  }

  async getParent (room) {
    const parts = room.path.split('.')
    if (parts && parts.length) {
      parts.pop()
    }
    const parent = await Room.findOne({ path: parts.join('.') }).exec()
    return parent
  }

  async getParents (room) {
    const parts = room.path.split('.')
    if (parts && parts.length) {
      parts.pop()
      const paths = parts.map((part, index) => parts.reduce((acc, curr, ind) => {
        if (ind <= index) {
          return acc ? `${acc}.${curr}` : `${curr}`
        }
        return acc
      }, ''))
      const parents = await Room.find({ path: { $in: paths } }).exec()
      return parents
    }
    return []
  }

  async getChildren (room, userid) {
    const children = await Room.find({ path: new RegExp(`^${room.path}\\.`, 'i') }).exec()
    return children
  }

  async getVisibleChildren (records, userid) {
    const filter = new RoomChildrenFilter({
      records,
      userid
    })
    const additionalRecords = await Room.find(filter.getFilter()).exec()
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

  async delete (room) {
    const roomFilter = new RoomDeleteFilter({
      room
    })
      .getFilter()
    const result = await Room
      .deleteMany(roomFilter)
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
    const remainingTypes = config.dataSettings.invite.types.map(t => `${t}s`).filter(t => t !== type)
    const update = {
      $addToSet: {},
      $pullAll: {}
    }
    remainingTypes.forEach((t) => {
      update.$pullAll[t] = users
    })
    update.$addToSet[type] = users
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
    const roomRenameFilter = new RoomRenameFilter({
      oldname,
      oldpath,
      newname,
      newpath
    })
    const result = await Room.updateMany(
      roomRenameFilter.getFilter(),
      roomRenameFilter.getUpdate(),
      options
    )
    return result
  }

  async pushCall (userid, roomid, id) {
    const update = {
      $addToSet: {
        calls: id
      }
    }
    const result = await this.update(userid, roomid, update)
    return result
  }

  async pullCall (userid, roomid, id) {
    const update = {
      $pull: {
        calls: id
      }
    }
    const result = await this.update(userid, roomid, update)
    return result
  }
}

module.exports = new RoomService()
