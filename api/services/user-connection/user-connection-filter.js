const mongoose = require('mongoose')
class UserConnectionFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        throw new TypeError('Invalid user connection id!')
      }
    }
    if (options.conn_id) {
      this.filter.conn_id = options.conn_id
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = UserConnectionFilter
