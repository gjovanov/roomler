const mongoose = require('mongoose')
class CallFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        this.filter.call_id = options.id
      }
    }
    if (options.connection && mongoose.Types.ObjectId.isValid(options.connection)) {
      this.filter.connection = mongoose.Types.ObjectId(options.connection)
    }
    if (options.ids) {
      if (options.ids.filter(id => !mongoose.Types.ObjectId.isValid(id)).length > 0) {
        throw new TypeError('Invalid call id!')
      } else {
        this.filter._id = {
          $in: options.ids
        }
      }
    }
    if (options.status) {
      this.filter.status = options.status
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = CallFilter
