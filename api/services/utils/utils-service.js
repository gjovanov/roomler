const config = require('../../../config')

class UtilsService {
  tokenizeUser (user) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      is_admin: config.authSettings.superAdminEmails.includes(user.email),
      timestamp: user.createdAt.getTime()
    }
  }
}

module.exports = new UtilsService()
