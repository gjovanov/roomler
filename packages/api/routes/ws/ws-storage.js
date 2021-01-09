/*
WS storage
Example: {
  'username1': [ conn1, conn2 ], // connections from 2 difference devices/browsers
  'username2': [ conn3, conn4, conn5 ] // connections from 3 difference devices/browsers
  ...
  'Anonymous': [ conn6, conn7, ...] // anonymous users
}
*/
class WsStorage {
  constructor () {
    this.clients = {}
    this.anonymous = 'Anonymous'
  }

  push (conn) {
    if (conn.user && conn.user._id) {
      const userid = JSON.stringify(conn.user._id)
      if (!this.clients[userid]) {
        this.clients[userid] = []
      }
      this.clients[userid].push(conn)
    } else {
      if (!this.clients[this.anonymous]) {
        this.clients[this.anonymous] = []
      }
      this.clients[this.anonymous].push(conn)
    }
  }

  pull (conn) {
    if (conn.user && conn.user._id && conn.user.username) {
      const userid = JSON.stringify(conn.user._id)
      const conns = this.clients[userid] || []
      this.clients[userid] = conns.filter(c => c.id !== conn.id)
    } else {
      this.clients[this.anonymous] = this.clients[this.anonymous].filter(c => c.id !== conn.id)
    }
  }
}

module.exports = new WsStorage()
