module.exports = {
  call: {
    statuses: ['open', 'closed', 'stale'],
    defaults: {
      status: 'open'
    }
  },
  connection: {
    statuses: ['open', 'closed', 'stale'],
    defaults: {
      status: 'open'
    }
  },
  room: {
    defaults: {
      is_open: true,
      media: {
        publishers: 30,
        is_private: false,
        bitrate: 128000,
        fir_freq: 0,
        audiocodec: 'opus,pcmu',
        videocodec: 'vp8,h264',
        record: false,
        notify_joining: true
      }
    }
  },
  code: {
    types: ['user_activation', 'username_reset', 'password_reset']
  },
  invite: {
    statuses: ['pending', 'accepted', 'rejected'],
    types: ['member', 'moderator'],
    defaults: {
      type: 'member',
      status: 'pending'
    }
  },
  message: {
    types: ['text'],
    defaults: {
      type: 'text'
    }
  }
}
