class RoomContext {
  constructor(data, tokenProvider) {
    this.payload = data.payload
    this.invalidroomid = data.invalidroomid
    this.newname = data.newname
    this.tokenProvider = tokenProvider
    this.record = null
  }

  get token() {
    return this.tokenProvider.token
  }

}

module.exports = RoomContext
