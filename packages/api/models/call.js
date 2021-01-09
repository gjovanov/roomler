const mongoose = require('mongoose')
const config = require('roomler.config')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const statuses = config.dataSettings.call.statuses
const defaults = config.dataSettings.call.defaults

const schema = new Schema({
  call_id: {
    type: String,
    required: 'CallIdIsRequired',
    maxlength: 40,
    index: true
  },
  connection: {
    type: ObjectId,
    ref: 'connections',
    index: true
  },
  room: {
    type: ObjectId,
    ref: 'rooms',
    index: true
  },
  user: {
    type: ObjectId,
    ref: 'users',
    index: true
  },
  status: {
    type: String,
    enum: statuses,
    default: defaults.status,
    required: 'StatusIsRequired',
    maxlength: 50
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})
schema.virtual('userObj', {
  ref: 'users',
  localField: 'user',
  foreignField: '_id',
  justOne: true
})

schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
schema.index({ status: 1 }, { partialFilterExpression: { status: 'open' } })
module.exports = mongoose.model('calls', schema)
