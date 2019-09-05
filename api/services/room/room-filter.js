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

  addUserFilter (userid) {
    this.filter = userid ? {
      $and: [{
        $or: [{
          owner: mongoose.Types.ObjectId(userid)
        },
        {
          moderators: mongoose.Types.ObjectId(userid)
        }, {
          members: mongoose.Types.ObjectId(userid)
        }
        ]
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
