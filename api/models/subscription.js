const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Schema = mongoose.Schema

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: 'users',
    required: 'UserInvalid',
    index: true
  },
  endpoint: String,
  expirationTime: {
    type: String,
    default: null
  },
  keys: {
    auth: String,
    p256dh: String
  }
}, {
  timestamps: true
})

schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
schema.index({ status: 1 }, { partialFilterExpression: { status: 'open' } })
module.exports = mongoose.model('subscriptions', schema)
