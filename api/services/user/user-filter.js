const mongoose = require('mongoose')
class UserFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        this.filter.username = options.id
      }
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = UserFilter
