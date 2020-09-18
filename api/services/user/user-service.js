const config = require('../../../config')
const User = require('../../models/user')
const Room = require('../../models/room')
const codeService = require('../code/code-service')
const emailService = require('../email/email-service')
const asteriskService = require('../asterisk/asterisk-service')
const validateUserExists = require('./validation/validate-user-exists')
const validateUserToken = require('./validation/validate-user-token')
const validateUserAdmin = require('./validation/validate-user-admin')
const validateUserTokenDbMatch = require('./validation/validate-user-token-db-match')
const validatePasswordIsConfirmed = require('./validation/validate-password-is-confirmed')
const validatePasswordsMatch = require('./validation/validate-passwords-match')
const validateActivationCode = require('./validation/validate-activation-code')
const UserFilter = require('./user-filter')
const PeerFilter = require('./peer-filter')

class UserService {
  // base methods - START
  async get (filter) {
    const userFilter = new UserFilter({
      query: filter.query,
      id: filter.id,
      username: filter.username,
      email: filter.email
    })
      .getFilter()
    const record = await User
      .findOne(userFilter)
      .select('+password')
      .exec()
    return record
  }

  async getAll (filter) {
    const userFilter = new UserFilter({
      ids: filter.ids
    })
      .getFilter()
    const records = await User
      .find(userFilter)
      .exec()
    return records
  }

  async getAdmins () {
    const records = await User.find({ email: { $in: config.authSettings.superAdminEmails } })
    return records
  }

  async getPeers (userid) {
    const aggregate = new PeerFilter()
      .addMatch(userid)
      .addProjectUsers()
      .addLookup()
      .addProjectPeers()
      .getAggregate()

    const records = await Room
      .aggregate(aggregate)
      .exec()
    return records && records.length && records[0].peers ? records[0].peers : []
  }

  async create (data) {
    let record = new User(data)
    record = await record.save()
    return record
  }

  async update (id, update) {
    const userFilter = new UserFilter({
      id
    })
      .getFilter()
    const options = {
      new: true
    }
    const record = await User
      .findOneAndUpdate(userFilter, update, options)
    return record
  }

  async delete (id) {
    const userFilter = new UserFilter({
      id
    })
      .getFilter()
    const result = await User
      .deleteOne(userFilter)
      .exec()
    return result
  }

  // base methods - END

  async register (data) {
    const user = await this.create(data)
    await codeService.generateCode(user, 'user_activation', !data.is_active)
    if (config.asteriskSettings.url) {
      await asteriskService.createRecords(user)
    }
    return user
  }

  async updateAvatar (id, url) {
    const update = {
      $set: {
        avatar_url: url
      }
    }
    const record = await this.update(id, update)
    return record
  }

  async updateUsername (email, token, username) {
    let user = await this.get({
      email
    })
    validateUserExists(user)
    const code = await codeService.get(user.username, 'username_reset', token)
    validateActivationCode(code)
    const update = {
      $set: {
        username,
        is_username_set: true
      }
    }
    user = await this.update(user._id, update)
    await emailService.send(user._id, {
      to: user.email,
      subject: 'Username was successfully reset',
      template: 'username-reset-success.hbs',
      model: {
        name: user.username
      }
    })
    return user
  }

  async updatePassword (email, token, password, passwordConfirm) {
    validatePasswordIsConfirmed(password, passwordConfirm)
    let user = await this.get({
      email
    })
    validateUserExists(user)
    const code = await codeService.get(user.username, 'password_reset', token)
    validateActivationCode(code)
    const update = {
      $set: {
        password,
        is_password_set: true
      }
    }
    user = await this.update(user._id, update)
    await emailService.send(user._id, {
      to: user.email,
      subject: 'Password was successfully reset',
      template: 'password-reset-success.hbs',
      model: {
        name: user.username
      }
    })
    return user
  }

  async activate (username, token) {
    let user = await this.get({
      username
    })
    validateUserExists(user)
    const code = await codeService.get(user.username, 'user_activation', token)
    validateActivationCode(code)
    const update = {
      is_active: true
    }
    user = await this.update(user._id, update)
    await emailService.send(user._id, {
      to: user.email,
      subject: 'Account was successfully activated',
      template: 'user-activation-success.hbs',
      model: {
        name: user.username
      }
    })
    return user
  }

  async reset (email, type) {
    const user = await this.get({
      email
    })
    validateUserExists(user)
    const code = await codeService.generateCode(user, type)
    return code
  }

  async login (username, password) {
    const user = await this.get({
      username
    })
    validateUserExists(user)
    await validatePasswordsMatch(user, password)
    return user
  }

  async verify (user) {
    validateUserToken(user)
    const userFromDb = await this.get({
      username: user.username
    })
    validateUserTokenDbMatch(user, userFromDb)
    return user
  }

  isAdmin (user) {
    validateUserAdmin(user)
    return user
  }

  async pushConnection (userid, id) {
    const update = {
      $addToSet: {
        connections: id
      }
    }
    const result = await this.update(userid, update)
    return result
  }

  async pullConnection (userid, id) {
    const update = {
      $pull: {
        connections: id
      }
    }
    const result = await this.update(userid, update)
    return result
  }
}

module.exports = new UserService()
