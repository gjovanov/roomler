const Email = require('../../models/email')
const factory = require('./email-factory')
const EmailFilter = require('./email-filter')

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

  async get (userid, id) {
    const emailFilter = new EmailFilter({
      id
    })
      .addUserFilter(userid)
      .getFilter()
    const record = await Email
      .findOne(emailFilter)
      .populate('creator')
      .exec()
    return record
  }

  async getAll (userid, page = 0, size = 10, filter = {}, sort = {
    createdAt: 'desc'
  }) {
    const emailFilter = new EmailFilter({
      filter
    })
      .addUserFilter(userid)
      .getFilter()
    const pageInt = parseInt(page)
    const sizeInt = parseInt(size)
    const records = await Email
      .find(emailFilter)
      .populate('creator')
      .sort(sort)
      .skip(pageInt * sizeInt)
      .limit(sizeInt)
      .exec()
    return records
  }

  async delete (userid, id) {
    const emailFilter = new EmailFilter({
      id
    })
      .addUserFilter(userid)
      .getFilter()
    const result = await Email
      .deleteOne(emailFilter)
      .exec()
    return result
  }
}

module.exports = new EmailService()
