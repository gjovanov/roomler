const mongoose = require('mongoose')
class RoomFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.query) {
      this.filter.$or = []
      if (mongoose.Types.ObjectId.isValid(options.query)) {
        this.filter.$or.push({ _id: mongoose.Types.ObjectId(options.query) })
      }
      this.filter.$or.push({ name: options.query })
      this.filter.$or.push({ path: options.query })
    } else if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        throw new TypeError('Invalid room id!')
      }
    }
  }

  addOwnerFilter (userid) {
    this.filter = userid ? {
      $and: [
        { owner: mongoose.Types.ObjectId(userid) },
        this.filter
      ]
    } : this.filter
    return this
  }

  addUserFilter (userid, roles = ['owner', 'moderators', 'members']) {
    const roleFilter = roles.map((r) => {
      const result = {}
      if (userid && ['owner', 'moderators', 'members'].includes(r)) {
        result[r] = mongoose.Types.ObjectId(userid)
      } else if (r === 'open') {
        result.is_open = true
      } else if (Array.isArray(r)) {
        result.$or = [
          { moderators: { $in: r } },
          { members: { $in: r } }
        ]
      }
      return result
    })
    this.filter = userid ? {
      $and: [{
        $or: roleFilter
      },
      this.filter
      ]
    } : this.filter
    return this
  }

  getFilter () {
    return this.filter
  }
}

module.exports = RoomFilter
