const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new Schema({
  creator: {
    type: ObjectId,
    ref: 'users',
    required: 'CreatorInvalid',
    index: true
  },
  from: {
    type: String,
    required: 'FromInvalid',
    index: true
  },
  to: {
    type: String,
    required: 'ToInvalid',
    index: true
  },
  cc: {
    type: String
  },
  type: {
    type: String
  },
  subject: {
    type: String
  },
  body: {
    type: String
  }
}, {
  timestamps: true
})
schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
module.exports = mongoose.model('emails', schema)
