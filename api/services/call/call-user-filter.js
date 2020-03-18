const mongoose = require('mongoose')

class CallUserFilter {
  constructor (options) {
    if (options.user && (!mongoose.Types.ObjectId.isValid(options.user)) {
      throw new TypeError('Invalid user id!')
    }
    if (options.connection && !mongoose.Types.ObjectId.isValid(options.connection)) {
      throw new TypeError('Invalid connection id!')
    }
    if (options.room && !mongoose.Types.ObjectId.isValid(options.room)) {
      throw new TypeError('Invalid room id!')
    }
    this.filter = {
      $and:
      [
        { user: mongoose.Types.ObjectId(options.user) },
        { connection: mongoose.Types.ObjectId(options.connection) },
        { status: options.status || 'open' }
      ]
    }
    if (options.room) {
      this.filter.$and.push({ room: mongoose.Types.ObjectId(options.room) })
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = CallUserFilter
