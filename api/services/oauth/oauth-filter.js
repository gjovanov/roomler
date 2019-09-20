const mongoose = require('mongoose')
class OAuthFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.type) {
      this.type = options.type
    }
    if (options.email) {
      this.email = options.email
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
