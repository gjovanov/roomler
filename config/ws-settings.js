
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

const pingInterval = process.env.NODE_ENV === 'test' ? 5000 : (process.env.WS_PING_INTERVAL || 30000)

module.exports = {
  pingInterval,
  opTypes: {
    hello: 'HELLO',

    messageCreate: 'MESSAGE_CREATE',
    messageUpdate: 'MESSAGE_UPDATE',
    messageDelete: 'MESSAGE_DELETE',

    messageReactionPush: 'MESSAGE_REACTION_PUSH',
    messageReactionPull: 'MESSAGE_REACTION_PULL',

    connectionOpen: 'CONNECTION_OPEN',
    connectionClose: 'CONNECTION_CLOSE',
    connectionUpdate: 'CONNECTION_UPDATE',

    visitOpen: 'VISIT_OPEN',
    visitClose: 'VISIT_CLOSE',

    roomCreate: 'ROOM_CREATE',
    roomUpdate: 'ROOM_UPDATE',
    roomDelete: 'ROOM_DELETE',

    roomInviteAccept: 'ROOM_INVITE_ACCEPT',
    roomInviteReject: 'ROOM_INVITE_REJECT',
    roomInviteUpdate: 'ROOM_INVITE_UPDATE',
    roomInviteDelete: 'ROOM_INVITE_DELETE',

    roomPeerRoleUpdate: 'ROOM_PEER_ROLE_UPDATE',
    roomPeerAdd: 'ROOM_PEER_ADD',
    roomPeerRemove: 'ROOM_PEER_REMOVE',
    roomPeerJoin: 'ROOM_PEER_JOIN',
    roomPeerLeave: 'ROOM_PEER_LEAVE',
    roomCallOpen: 'ROOM_CALL_OPEN',
    roomCallClose: 'ROOM_CALL_CLOSE'
  },
  scaleout
}
