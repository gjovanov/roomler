const mongoose = require('mongoose')
class OAuthFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.id) {
      if (mongoose.Types.ObjectId.isValid(options.id)) {
        this.filter._id = mongoose.Types.ObjectId(options.id)
      } else {
        throw new TypeError('Invalid oauth id!')
      }
    }
    if (options.type) {
      this.filter.type = options.type
    }
    if (options.email) {
      this.filter.email = options.email
    }
  }

  addUserFilter (userid) {
    this.filter = userid ? {
      $and: [{
        user: mongoose.Types.ObjectId(userid)
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

module.exports = OAuthFilter
