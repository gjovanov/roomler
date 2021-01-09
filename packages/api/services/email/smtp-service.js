const nodemailer = require('nodemailer')
const config = require('roomler.config')
const templateService = require('./template-service')

class SmtpService {
  constructor () {
    if (!config.emailSettings.smtp) {
      throw new Error('Missing SMTP configuration')
    }
    const settings = config.emailSettings.smtp
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
    message.type = 'smtp'
    message.body = message.html
    return message
  }
}

module.exports = new SmtpService()
