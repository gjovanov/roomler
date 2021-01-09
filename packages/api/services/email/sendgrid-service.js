const sendgrid = require('@sendgrid/mail')
const config = require('roomler.config')
const templateService = require('./template-service')

class SendgridService {
  constructor () {
    if (!config.emailSettings.sendgrid) {
      throw new Error('Missing SendGrid configuration')
    }
    const settings = config.emailSettings.sendgrid
    sendgrid.setApiKey(settings.apiKey)
    this.sendgrid = sendgrid
  }

  async send (params) {
    const html = params.body || templateService.render(params.template, params.model)

    // Remap the properties based on SendGrid Docs:
    // https://nodemailer.com/message/attachments/ - From this format
    // https://github.com/sendgrid/sendgrid-nodejs/blob/master/use-cases/attachments.md - To this format
    // https://sendgrid.com/docs/API_Reference/api_v3.html
    if (params.attachments) {
      params.attachments.forEach((attachment) => {
        attachment.contentId = attachment.cid
        attachment.type = attachment.contentType
        attachment.disposition = attachment.contentDisposition
      })
    }
    const message = {
      from: params.from || config.emailSettings.fromEmail,
      to: params.to,
      subject: params.subject,
      html,
      attachments: params.attachments
    }
    await this.sendgrid.send(message)
    message.type = 'sendgrid'
    message.body = message.html
    return message
  }
}

module.exports = new SendgridService()
