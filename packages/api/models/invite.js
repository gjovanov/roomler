const mongoose = require('mongoose')
const config = require('roomler.config')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const statuses = config.dataSettings.invite.statuses
const types = config.dataSettings.invite.types
const defaults = config.dataSettings.invite.defaults

const schema = new Schema({
  inviter: {
    type: ObjectId,
    ref: 'users',
    required: 'InviterIsRequired',
    index: true
  },
  room: {
    type: ObjectId,
    ref: 'rooms',
    required: 'RoomIsRequired',
    index: true
  },
  email: {
    type: String,
    required: 'EmailIsRequired'
  },
  name: {
    type: String,
    required: 'NameIsRequired'
  },
  type: {
    type: String,
    required: 'TypeIsRequired',
    enum: types,
    default: defaults.type
  },
  status: {
    type: String,
    required: 'StatusIsRequired',
    enum: statuses,
    default: defaults.status
  },
  invitee: {
    type: ObjectId,
    ref: 'users',
    index: true
  }
}, {
  timestamps: true
})
schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })

module.exports = mongoose.model('invites', schema)
