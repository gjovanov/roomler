module.exports = {
  invalidUsername: 'unexisting_username',
  invalidToken: 'invalid_token',
  invalidPassword: 'invalid_password',
  user: {
    payload: {
      username: 'authuser',
      email: 'authuser@gmail.com',
      password: '12345678',
      passwordConfirm: '12345678'
    },
    update: {
      password: '123456789'
    }
  },
  person: {
    payload: {
      firstname: 'John',
      lastname: 'Smith',
      imageUrl: 'http://google.com'
    }
  }
}
