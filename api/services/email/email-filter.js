const mongoose = require('mongoose')
class EmailFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        throw new TypeError('Invalid email id!')
      }
    }
  }

  addUserFilter (userid) {
    this.filter = userid ? {
      $and: [{
        creator: mongoose.Types.ObjectId(userid)
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

module.exports = EmailFilter
