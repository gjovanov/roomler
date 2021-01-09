const randomstring = require('randomstring')
const emailService = require('../email/email-service')
const Code = require('../../models/code')
const config = require('roomler.config')
const CodeFilter = require('./code-filter')

class CodeService {
  // base methods - START
  async get (username, type, token) {
    const codeFilter = new CodeFilter(username, type, token)
      .getFilter()
    const record = await Code
      .findOne(codeFilter)
      .exec()
    return record
  }

  async create (username, type) {
    const token = randomstring.generate(7)
    const validto = new Date(+new Date() + config.authSettings.codeValidityInMinutes * 60 * 1000)
    const data = {
      username,
      token,
      type,
      validto
    }
    let record = new Code(data)
    record = await record.save()
    return record
  }

  // base methods - END
  async generateCode (user, type, sendEmail = true) {
    const code = await this.create(user.username, type)
    if (sendEmail) {
      if (type === 'user_activation') {
        const url = `${config.appSettings.env.URL}${config.authSettings.userActivationPage}?user=${user.username}&token=${code.token}`
        await emailService.send(user._id, {
          to: user.email,
          subject: 'Activate your account',
          template: 'user-activation.hbs',
          model: {
            name: user.username,
            url
          }
        })
      } else if (type === 'username_reset') {
        const url = `${config.appSettings.env.URL}${config.authSettings.updateUsernamePage}?email=${user.email}&token=${code.token}`
        await emailService.send(user._id, {
          to: user.email,
          subject: 'Reset your username',
          template: 'username-reset.hbs',
          model: {
            name: user.username,
            url
          }
        })
      } else if (type === 'password_reset') {
        const url = `${config.appSettings.env.URL}${config.authSettings.updatePasswordPage}?email=${user.email}&token=${code.token}`
        await emailService.send(user._id, {
          to: user.email,
          subject: 'Reset your password',
          template: 'password-reset.hbs',
          model: {
            name: user.username,
            url
          }
        })
      }
    }

    return code
  }
}

module.exports = new CodeService()
