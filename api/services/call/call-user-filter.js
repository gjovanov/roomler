const mongoose = require('mongoose')

class CallUserFilter {
  constructor (options) {
    if (!mongoose.Types.ObjectId.isValid(options.user)) {
      throw new TypeError('Invalid user id!')
    }
    if (!mongoose.Types.ObjectId.isValid(options.room)) {
      throw new TypeError('Invalid room id!')
    }
    this.filter = {
      $and:
      [
        { room: mongoose.Types.ObjectId(options.room) },
        { user: mongoose.Types.ObjectId(options.user) },
        { status: options.status || 'open' }
      ]
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = CallUserFilter
