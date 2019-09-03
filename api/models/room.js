const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-long')(mongoose)
const Long = mongoose.Schema.Types.Long
const ObjectId = mongoose.Schema.Types.ObjectId
const config = require('../../config')
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
  isopen: {
    type: Boolean,
    default: defaults.isopen
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
  settings: {
    media: {
      roomid: {
        type: Long,
        index: true
      },
      publishers: {
        type: Number,
        default: defaults.settings.media.publishers
      },
      secret: {
        type: String // optional password needed for manipulating (e.g. destroying) the room
      },
      pin: {
        type: String // optional password needed for joining the room
      },
      bitrate: {
        type: Number,
        default: defaults.settings.media.bitrate
      },
      fir_freq: {
        type: Number,
        default: defaults.settings.media.fir_freq
      },
      audiocodec: {
        type: String,
        default: defaults.settings.media.audiocodec
      },
      videocodec: {
        type: String,
        default: defaults.settings.media.videocodec
      },
      record: {
        type: Boolean,
        default: defaults.settings.media.record
      },
      rec_dir: {
        type: String
      }
    }
  }
}, {
  timestamps: true
})
schema.index({
  createdAt: 1
})
module.exports = mongoose.model('rooms', schema)
