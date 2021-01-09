const nodemailer = require('nodemailer')
const config = require('roomler.config')
const templateService = require('./template-service')

class GmailService {
  constructor () {
    if (!config.emailSettings.gmail) {
      throw new Error('Missing GMAIL configuration')
    }
    const settings = config.emailSettings.gmail
    this.transporter = nodemailer.createTransport(settings)
  }

  async send (params) {
    const html = params.body || templateService.render(params.template, params.model)
    const message = {
      from: params.from || config.emailSettings.fromEmail,
      to: params.to,
      subject: params.subject,
      html,
      attachments: params.attachments
    }
    await this.transporter.sendMail(message)
    message.type = 'gmail'
    message.body = message.html
    return message
  }
}

module.exports = new GmailService()
