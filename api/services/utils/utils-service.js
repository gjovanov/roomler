class UtilsService {
  tokenizeUser (user) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      is_active: user.is_active
    }
  }
}

module.exports = new UtilsService()
