const mongoose = require('mongoose')
class UserFilter {
  constructor (options) {
    this.filter = options.filter || {}
    if (!!options.query && !!options.id && !!options.username && !!options.email) {
      throw new TypeError('Invalid user id!')
    }
    // search by either: 1. general query (_id or username or email), 2. ids, 3. specific param (_id, username, email)
    if (options.query) {
      this.filter.$or = []
      if (mongoose.Types.ObjectId.isValid(options.query)) {
        this.filter.$or.push({ _id: mongoose.Types.ObjectId(options.query) })
      }
      this.filter.$or.push({ username: options.query })
      this.filter.$or.push({ email: options.query })
    } else if (options.ids) {
      this.filter._id = { $in: options.ids }
    } else {
      if (options.id) {
        if (mongoose.Types.ObjectId.isValid(options.id)) {
          this.filter._id = mongoose.Types.ObjectId(options.id)
        } else {
          throw new TypeError('Invalid user id!')
        }
      }
      if (options.username) {
        this.filter.username = options.username
      }
      if (options.email) {
        this.filter.email = options.email
      }
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = UserFilter
