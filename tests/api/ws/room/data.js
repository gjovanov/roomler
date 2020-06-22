module.exports = {
  user: {
    user1: {
      payload: {
        username: 'wsroomuser1',
        email: 'wsroomuser1@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      }
    },
    user2: {
      payload: {
        username: 'wsroomuser2',
        email: 'wsroomuser2@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      }
    }
  },

  room1: {
    payload: {
      name: 'Parent',
      tags: ['super', 'dooper']
    },
    update: {
      name: 'Parent1'
    }
  },
  room2: {
    payload: {
      name: 'Parent.Child',
      tags: ['super', 'dooper']
    }
  }
}
