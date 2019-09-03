class MessageContext {
  constructor(data, userContext, roomContext, userContexts) {
    this.payload = data.payload
    this.update = data.update
    this.userContext = userContext
    this.roomContext = roomContext
    this.users = userContexts || []
    this.records = []
  }

  get token() {
    return this.userContext.token
  }

  get room() {
    return this.roomContext.record
  }

  getMentionIds(payloadMessage) {
    const result = []
    if (payloadMessage.mentions) {
      payloadMessage.mentions.forEach(mention => {
        const user = this.users.find(u => u.record.username === mention)
        if (user) {
          result.push(user.record._id)
        }
      })
    }
    return result
  }

  getReadbyIds(payloadMessage) {
    const result = []
    if (payloadMessage.readby) {
      payloadMessage.readby.forEach(readby => {
        const user = this.userContext.find(u => u.record.username === readby)
        if (user) {
          result.push(user.record._id)
        }
      })
    }
    return result
  }
}

module.exports = MessageContext
