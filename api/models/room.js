const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-long')(mongoose)
const Long = mongoose.Schema.Types.Long
const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new Schema({
  roomid: {
    type: Long,
    required: 'RoomIdInvalid',
    index: true,
    unique: true
  },
  owner: {
    type: ObjectId,
    ref: 'users',
    required: 'OwnerInvalid',
    index: true
  },
  name: {
    type: String,
    required: 'NameInvalid',
    index: true
  },
  description: {
    type: String
  },
  secret: {
    type: String
  },
  bitrate: {
    type: Number,
    required: 'BitrateInvalid'
  },
  fir_freq: {
    type: Number
  },
  audiocodec: {
    type: String,
    required: 'AudioCodecInvalid'
  },
  videocodec: {
    type: String,
    required: 'VideoCodecInvalid'
  },
  record: {
    type: Boolean,
    required: 'RecordInvalid'
  },
  rec_dir: {
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
  }]
}, {
  timestamps: true
})
schema.index({
  createdAt: 1
})
module.exports = mongoose.model('rooms', schema)
