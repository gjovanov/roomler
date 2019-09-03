class RoomContext {
  constructor(data, userContext) {
    this.payload = data.payload
    this.invalidroomid = data.invalidroomid
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
