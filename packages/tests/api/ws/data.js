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
    },
    user3: {
      payload: {
        username: 'wsroomuser3',
        email: 'wsroomuser3@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      }
    },
    user4: {
      payload: {
        username: 'wsroomuser4',
        email: 'wsroomuser4@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      },
      invite: {
        name: 'wsroomuser4',
        email: 'wsroomuser4@gmail.com',
        type: 'member'
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
    },
    messages: {
      message1: {
        type: 'text',
        content: '<p>Welcome on board!</p>',
        mentions: [],
        reactions: [],
        files: []
      }
    },
    reactions: {
      reaction1: {
        name: '+1',
        symbol: '👍'
      }
    }
  },
  room2: {
    payload: {
      name: 'Parent.Child',
      tags: ['super', 'dooper']
    },
    messages: {
      message1: {
        type: 'text',
        content: '<p>Hi there</p>',
        mentions: [],
        reactions: [],
        files: []
      },
      message2: {
        type: 'text',
        content: '<p>Hello br</p>',
        mentions: [],
        reactions: [],
        files: []
      },
      message2Update: {
        type: 'text',
        content: '<p>Hello bro</p>',
        mentions: [],
        reactions: [],
        files: []
      }
    }
  }
}
