module.exports = {
  invalidInviteId: 'kjahsdk',
  user: {
    inviter: {
      payload: {
        username: 'userinviter',
        email: 'userinviter@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      }
    },
    inviteeMember: {
      payload: {
        username: 'userinviteemember',
        email: 'userinviteemember@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      },
      update: {
        name: 'My new member'
      }
    },
    inviteeModerator: {
      payload: {
        username: 'userinviteemoderator',
        email: 'userinviteemoderator@gmail.com',
        password: '12345678',
        passwordConfirm: '12345678'
      },
      update: {
        name: 'My new moderator'
      }
    }
  },

  room: {
    payload: {
      name: 'TestRoomInvite'
    }
  },

  invite: {
    payload: [{
      name: 'userinviteemember',
      email: 'userinviteemember@gmail.com',
      type: 'member'
    },
    {
      name: 'userinviteemoderator',
      email: 'userinviteemoderator@gmail.com',
      type: 'moderator'
    }
    ],
    update: {
      name: 'userinviteemember',
      email: 'userinviteemember@gmail.com',
      type: 'moderator'
    }
  }
}
