class UserContext {
  constructor(data, personData, oauth) {
    this.payload = data.payload
    this.update = data.update
    if (personData) {
      this.person = {
        payload: personData.payload,
        update: personData.update
      }
    }
    this.oauth = oauth
    this.record = null
    this.token = null
    this.code = null
  }
}

module.exports = UserContext
