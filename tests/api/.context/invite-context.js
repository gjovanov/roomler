class InviteContext {
  constructor(data, userContext, roomContext) {
    this.payload = data.payload
    this.update = data.update
    this.userContext = userContext
    this.roomContext = roomContext
    this.records = []
  }

  get token() {
    return this.userContext.token
  }

  get room() {
    return this.roomContext.record
  }
}

module.exports = InviteContext
