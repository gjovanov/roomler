class UserContext {
  constructor(data, avatar, oauth) {
    this.payload = data.payload
    this.update = data.update
    if (avatar) {
      this.avatar = avatar
    }
    this.oauth = oauth
    this.record = null
    this.token = null
    this.code = null
  }
}

module.exports = UserContext
