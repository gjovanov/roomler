const mongoose = require('mongoose')
class SubscriptionFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (options.users) {
      const users = options.users.map(user => mongoose.Types.ObjectId(user))
      this.filter.user = {
        $in: users
      }
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = SubscriptionFilter
