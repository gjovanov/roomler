module.exports = {
  user: {
    payload: {
      username: 'roomuser',
      email: 'roomuser@gmail.com',
      password: '12345678',
      passwordConfirm: '12345678'
    }
  },

  room: {
    payload: {
      roomid: 9875,
      name: 'TestName',
      bitrate: 100000,
      fir_freq: 100000,
      record: false,
      audiocodec: 'opus',
      videocodec: 'vp8'
    },
    newname: 'TestName2',
    invalidroomid: 'sijndcijsc'
  }
}
