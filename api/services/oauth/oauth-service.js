const OAuth = require('../../models/oauth')
const OAuthFilter = require('./oauth-filter')

class OAuthService {
  // base methods - START
  async get (userid, type, email) {
    const oAuthFilter = new OAuthFilter({
      type,
      email
    })
      .addUserFilter(userid)
      .getFilter()
    const record = await OAuth
      .findOne(oAuthFilter)
      .populate('user')
      .exec()
    return record
  }

  async getAll (userid, page = 0, size = 10, filter = {}, sort = {
    createdAt: 'desc'
  }) {
    const oAuthFilter = new OAuthFilter({
      filter
    })
      .addUserFilter(userid)
      .getFilter()
    const pageInt = parseInt(page)
    const sizeInt = parseInt(size)
    const records = await OAuth
      .find(oAuthFilter)
      .populate('user')
      .sort(sort)
      .skip(pageInt * sizeInt)
      .limit(sizeInt)
      .exec()
    return records
  }

  async create (data) {
    let record = new OAuth(data)
    record = await record.save()
      .then(r =>
        r.populate('user')
          .execPopulate())
    return record
  }

  async update (userid, id, update) {
    const oAuthFilter = new OAuthFilter({
      id
    })
      .addUserFilter(userid)
      .getFilter()
    const options = {
      new: true
    }
    const record = await OAuth
      .findOneAndUpdate(oAuthFilter, update, options)
      .populate('user')
    if (!record) {
      throw new ReferenceError('OAuth was not found.')
    }
    return record
  }

  async delete (userid, id) {
    const oAuthFilter = new OAuthFilter({
      id
    })
      .addUserFilter(userid)
      .getFilter()
    const result = await OAuth
      .deleteOne(oAuthFilter)
      .exec()
    if (!result.deletedCount) {
      throw new ReferenceError('OAuth was not found.')
    }
    return result
  }
}

module.exports = new OAuthService()
