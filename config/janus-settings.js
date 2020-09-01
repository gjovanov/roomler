module.exports = {
  url: process.env.JANUS_URL || 'wss://mcu.xplorify.net/janus_ws',
  iceServers: [{
    urls: process.env.TURN_URL || 'turn:numb.viagenie.ca',
    username: process.env.TURN_USERNAME || 'webrtc@live.com',
    credential: process.env.TURN_PASSWORD || 'muazkh'
  }],
  plugins: {
    videoroom: 'janus.plugin.videoroom',
    textroom: 'janus.plugin.textroom',
    streaming: 'janus.plugin.streaming',
    sip: 'janus.plugin.sip',
    audiobridge: 'janus.plugin.audiobridge'
  },
  audioCodecs: ['opus', 'isac32', 'isac16', 'pcmu', 'pcma'],
  videoCodecs: ['vp8', 'vp9', 'h264']
}
