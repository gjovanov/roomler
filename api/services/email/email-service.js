const Email = require('../../models/email')
const factory = require('./email-factory')

class EmailService {
  async send (userid, data) {
    const service = factory.getService()
    const email = await service.send(data)
      .then((message) => {
        message.creator = userid
        const record = new Email(message)
        return record.save()
          .then(r =>
            r.populate('creator')
              .execPopulate())
      })
    return email
  }
}

module.exports = new EmailService()
