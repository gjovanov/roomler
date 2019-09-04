class EmailContext {
  constructor(data, userContext) {
    this.payload = data.payload
    this.userContext = userContext
    this.record = null
  }

  get token() {
    return this.userContext.token
  }

}

module.exports = EmailContext
