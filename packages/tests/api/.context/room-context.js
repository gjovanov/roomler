class RoomContext {
  constructor(data, userContext) {
    this.payload = data.payload
    this.update = data.update
    this.newname = data.newname
    this.userContext = userContext
    this.record = null
    this.messages = []
  }

  get token() {
    return this.userContext.token
  }

}

module.exports = RoomContext
