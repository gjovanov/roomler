const mongoose = require('mongoose')
class CallFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        throw new TypeError('Invalid call id!')
      }
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = CallFilter
