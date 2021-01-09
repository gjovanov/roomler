module.exports = {
  invalidMessageId: 'lakjsdj',
  reaction: {
    like: {
      name: 'like',
      symbol: '👍'
    },
    lol: {
      name: 'lol',
      symbol: '😂'
    }
  },
  user: {
    owner: {
      payload: {
        username: 'messageownersuser',
        email: 'messageownersuser@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      },
      message: {
        payload: [{
          content: 'Greetings by the room owner',
          mentions: ['messagemoderatorsuser', 'messagemmembersuser']
        },
        {
          content: 'The room owner welcomes you on board',
          mentions: ['messagemoderatorsuser', 'messagemmembersuser']
        }
        ]
      }
    },
    moderator: {
      payload: {
        username: 'messagemoderatorsuser',
        email: 'messagemoderatorsuser@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      },
      message: {
        payload: {
          content: 'Greetings by the room moderator',
          mentions: ['messagemoderatorsuser', 'messagemmembersuser']
        },
        update: {
          content: 'Greetings by the room moderator - IMPROVED',
          mentions: ['messagemmembersuser']
        }
      }
    },
    member: {
      payload: {
        username: 'messagemmembersuser',
        email: 'messagemmembersuser@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      }
    }
  },

  room: {
    payload: {
      name: 'TestRoomMessages'
    }
  }
}
