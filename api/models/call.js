const config = require('../../config')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const statuses = config.dataSettings.call.statuses
const defaults = config.dataSettings.call.defaults

const schema = new Schema({
  room: {
    type: ObjectId,
    ref: 'rooms',
    required: 'RoomIsRequired',
    index: true
  },
  user: {
    type: ObjectId,
    ref: 'users',
    required: 'UserIsRequired',
    index: true
  },
  connection: {
    type: ObjectId,
    ref: 'connections',
    index: true
  },
  status: {
    type: String,
    enum: statuses,
    default: defaults.status,
    required: 'StatusIsRequired',
    maxlength: 50,
    index: true
  },
  started: {
    type: Date,
    required: 'StartedIsRequired',
    index: true
  },
  ended: {
    type: Date
  }
}, {
  timestamps: true
})

schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
module.exports = mongoose.model('calls', schema)
