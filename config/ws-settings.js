
let defaultChannel = `global_${process.env.NODE_ENV}`
if (process.env.NODE_ENV === 'test') {
  defaultChannel += `_${process.env.TEST}`
}
const scaleout = {
  enabled: process.env.WS_SCALEOUT_ENABLED ? process.env.WS_SCALEOUT_ENABLED.toLowerCase() === 'true' : true,
  channel: process.env.WS_SCALEOUT_CHANNEL || defaultChannel,
  publisher: {
    namespace: 'publisher',
    host: process.env.WS_SCALEOUT_HOST || '127.0.0.1'
  },
  subscriber: {
    namespace: 'subscriber',
    host: process.env.WS_SCALEOUT_HOST || '127.0.0.1'
  }
}

module.exports = {
  opTypes: {
    messageCreate: 'MESSAGE_CREATE',
    messageUpdate: 'MESSAGE_UPDATE',
    messageDelete: 'MESSAGE_DELETE',
    messageReactionPush: 'MESSAGE_REACTION_PUSH',
    messageReactionPull: 'MESSAGE_REACTION_PULL',

    userConnectionOpened: 'USER_CONNECTION_OPENED',
    userConnectionClosed: 'USER_CONNECTION_CLOSED',

    roomCreate: 'ROOM_CREATE',
    roomUpdate: 'ROOM_UPDATE',
    roomDelete: 'ROOM_DELETE',
    roomJoin: 'ROOM_JOIN',
    roomLeave: 'ROOM_LEAVE'
  },
  scaleout
}
