module.exports = {
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
    name: 'My new member'
  },
  inviteeModerator: {
    payload: {
      username: 'userinviteemoderator',
      email: 'userinviteemoderator@gmail.com',
      password: '12345678',
      passwordConfirm: '12345678'
    },
    name: 'My new moderator'
  },

  room: {
    payload: {
      roomid: 9877,
      name: 'TestRoomInvite',
      bitrate: 100000,
      fir_freq: 100000,
      record: false,
      audiocodec: 'opus',
      videocodec: 'vp8'
    }
  }
}
