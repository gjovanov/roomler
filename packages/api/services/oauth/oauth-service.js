const generator = require('generate-password')
const slugify = require('slugify')
const userService = require('../user/user-service')
const OAuth = require('../../models/oauth')
const OAuthFilter = require('./oauth-filter')

const getOrCreateUser = async (data) => {
  let user = await userService.get({
    email: data.email
  })
  // if user doesn't exist, create new one with generated username (slug of name and suffix) and password
  if (!user) {
    const slugOptions = {
      replacement: '_', // replace spaces with replacement
      remove: null, // regex to remove characters
      lower: true // result in lower case
    }
    let username = `${slugify(data.name, slugOptions)}`
    const password = generator.generate({
      length: 17,
      strict: true
    })
    const userData = {
      username,
      email: data.email,
      password,
      is_active: true,
      is_username_set: false, // it's auto-generated, needs users override
      is_password_set: false, // it's auto-generated, needs users override
      avatar_url: data.avatar_url
    }
    try {
      user = await userService.register(userData)
    } catch (err) {
      // possible username is taken, then add a suffix in the username
      const suffix = generator.generate({
        length: 5,
        numbers: true,
        uppercase: false
      })
      username = `${slugify(data.name, slugOptions)}_${suffix}`
      userData.username = username
      user = await userService.register(userData)
    }
  }
  return user
}

class OAuthService {
  // base methods - START
  async get (userid, filter) {
    const oAuthFilter = new OAuthFilter({
      id: filter.id,
      type: filter.type,
      email: filter.email
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
    const user = await getOrCreateUser(data)
    data.user = user._id
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

  async link (userid, id) {
    const update = {
      $set: {
        user: userid
      }
    }
    const result = await this.update(null, id, update)
    return result
  }
}

module.exports = new OAuthService()
