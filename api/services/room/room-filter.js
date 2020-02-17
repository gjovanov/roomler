const mongoose = require('mongoose')
class RoomFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
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
      if (r !== 'open') {
        result[r] = mongoose.Types.ObjectId(userid)
      } else {
        result.is_open = true
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
