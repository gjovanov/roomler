if (typeof window !== 'undefined' && window.requestAnimationFrame === undefined) {
  window.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0)
  }
}
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  PORT_API: process.env.PORT_API || 3001
}
env.API_URL = process.env.API_URL || `http://${env.HOST}:${env.PORT_API}`

const config = {
  appSettings: {
    name: 'Roomler.Live',
    env
  },

  janusSettings: {
    iceServers: [{
      urls: process.env.TURN_URL || 'turn:numb.viagenie.ca',
      username: process.env.TURN_USERNAME || 'webrtc@live.com',
      credential: process.env.TURN_PASSWORD || 'muazkh'
    }],
    plugins: {
      videoroom: 'janus.plugin.videoroom',
      textroom: 'janus.plugin.textroom',
      streaming: 'janus.plugin.streaming'
    },
    audioCodecs: ['opus', 'isac32', 'isac16', 'pcmu', 'pcma'],
    videoCodecs: ['vp8', 'vp9', 'h264']
  },

  authSettings: {
    token: 'auth-token',
    codeValidityInMinutes: 5,
    userActivationPage: 'auth/user-activate',
    passwordResetPage: 'auth/password-reset',
    inviteAcceptPage: 'invite/accept',
    inviteRejectPage: 'invite/reject'
  },

  dbSettings: {
    dbUrl: process.env.DB_CONN || (process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/roomdbtest' : 'mongodb://localhost:27017/roomdb'),
    dbOptions: {
      family: 4,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  },

  dataSettings: {
    code: {
      types: ['user_activation', 'password_reset']
    },
    invite: {
      statuses: ['pending', 'accepted', 'rejected'],
      types: ['member', 'moderator']
    },
    message: {
      types: ['text']
    }
  },

  // use either SENDGRID or SMTP server
  emailSettings: {
    fromEmail: 'support@roomler.live',
    supportEmail: 'support@roomler.live',
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
}

if (config.emailSettings.smtp && config.emailSettings.smtp.auth && !config.emailSettings.smtp.auth.user) {
  config.emailSettings.smtp.auth = undefined
}
if (config.emailSettings.gmail && config.emailSettings.gmail.auth && !config.emailSettings.gmail.auth.user) {
  config.emailSettings.gmail.auth = undefined
}
if (!config.emailSettings.sendgrid.apiKey) {
  config.emailSettings.sendgrid = undefined
}
if (!config.emailSettings.gmail.auth) {
  config.emailSettings.gmail = undefined
}
if (!config.emailSettings.smtp.host) {
  config.emailSettings.smtp = undefined
}
if (process.env.NODE_ENV === 'development') {
  console.log(config)
}
module.exports = config
