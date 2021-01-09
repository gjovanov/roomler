// use either SENDGRID or SMTP server

const settings = {
  fromEmail: process.env.FROM_EMAIL || 'support@roomler.live',
  supportEmail: process.env.SUPPORT_EMAIL || 'support@roomler.live',
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || undefined
  },
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || undefined,
      pass: process.env.GMAIL_PASSWORD || undefined
    }
  },
  smtp: {
    host: process.env.SMTP_HOST || undefined,
    port: process.env.SMTP_PORT || 25,
    secure: process.env.SMTP_SECURE && process.env.SMTP_SECURE.toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER || undefined,
      pass: process.env.SMTP_PASSWORD || undefined
    }
  }
}

if (settings.smtp && settings.smtp.auth && !settings.smtp.auth.user) {
  settings.smtp.auth = undefined
}
if (settings.gmail && settings.gmail.auth && !settings.gmail.auth.user) {
  settings.gmail.auth = undefined
}
if (!settings.sendgrid.apiKey) {
  settings.sendgrid = undefined
}
if (!settings.gmail.auth) {
  settings.gmail = undefined
}
if (!settings.smtp.host) {
  settings.smtp = undefined
}

module.exports = settings
