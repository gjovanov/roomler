class CodeFilter {
  constructor (username, type = 'user_activation', token = undefined) {
    this.filter = {
      username,
      type,
      validto: {
        $gt: new Date()
      }
    }
    if (token) {
      this.filter.token = token
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = CodeFilter
