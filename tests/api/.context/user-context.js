class UserContext {
  constructor(data) {
    this.payload = data.payload
    this.record = null
    this.token = null
    this.code = null
  }
}

module.exports = UserContext
