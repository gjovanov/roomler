const mongoose = require('mongoose')
const config = require('roomler.config')
const Schema = mongoose.Schema
require('mongoose-long')(mongoose)
const Long = mongoose.Schema.Types.Long
const ObjectId = mongoose.Schema.Types.ObjectId
const defaults = config.dataSettings.room.defaults

const schema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'users',
    required: 'OwnerInvalid',
    index: true
  },
  name: {
    type: String,
    required: 'NameInvalid',
    index: true,
    unique: true
  },
  path: {
    type: String,
    required: 'PathInvalid',
    index: true,
    unique: true
  },
  emoji: {
    type: String
  },
  is_open: {
    type: Boolean,
    default: defaults.is_open
  },
  tags: [{
    type: String,
    index: true
  }],
  description: {
    type: String
  },
  moderators: [{
    type: ObjectId,
    ref: 'users',
    index: true
  }],
  members: [{
    type: ObjectId,
    ref: 'users',
    index: true
  }],
  media: {
    roomid: {
      type: Long,
      index: true
    },
    publishers: {
      type: Number,
      default: defaults.media.publishers
    },
    is_private: {
      type: Boolean,
      default: defaults.media.is_private
    },
    secret: {
      type: String // optional password needed for manipulating (e.g. destroying) the room
    },
    pin: {
      type: String // optional password needed for joining the room
    },
    bitrate: {
      type: Number,
      default: defaults.media.bitrate
    },
    fir_freq: {
      type: Number,
      default: defaults.media.fir_freq
    },
    audiocodec: {
      type: String,
      default: defaults.media.audiocodec
    },
    videocodec: {
      type: String,
      default: defaults.media.videocodec
    },
    record: {
      type: Boolean,
      default: defaults.media.record
    },
    rec_dir: {
      type: String
    },
    notify_joining: {
      type: Boolean,
      default: defaults.media.notify_joining
    },
    use_sip_bridge: {
      type: Boolean,
      default: defaults.media.use_sip_bridge
    }
  },
  calls: [{
    type: ObjectId,
    ref: 'calls',
    index: true
  }]
}, {
  timestamps: true
})
schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
// db.rooms.createIndex({ name: 'text', description: 'text', tags: 'text' })
schema.index({ name: 'text', description: 'text', tags: 'text' })
module.exports = mongoose.model('rooms', schema)
