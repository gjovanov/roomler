module.exports = {
  user: {
    payload: {
      username: 'emailuser',
      email: 'emailuser@gmail.com',
      password: '12345678',
      passwordConfirm: '12345678'
    }
  },
  email: {
    invalidId: 'jh23k4rh',
    template: {
      payload: {
        type: 'template',
        to: 'emailuser@gmail.com',
        subject: 'Account was successfully activated',
        template: 'user-activation-success.hbs',
        model: {
          name: 'testuser',
          platform: 'Our super duper platform'
        }
      }
    },
    direct: {
      payload: {
        type: 'direct',
        to: 'emailuser@gmail.com',
        subject: 'Account was successfully activated',
        body: '<h1>Hello world!</h1>'
      }
    }
  }
}
