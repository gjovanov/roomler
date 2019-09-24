class OAuthContext {
  constructor(data, type, user) {
    this.me = data.me
    this.update = data.update
    this.type = type
    this.record = null
    this.user = user
  }

  get token() {
    return this.user.token
  }
}

module.exports = OAuthContext
