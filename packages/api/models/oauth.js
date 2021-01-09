const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const config = require('roomler.config')
const types = config.oauthSettings.types

const schema = new Schema({
  type: {
    type: String,
    required: 'TypeInvalid',
    enum: types,
    index: true
  },
  email: {
    type: String
  },
  id: {
    type: String
  },
  name: {
    type: String
  },
  avatar_url: {
    type: String
  },
  user: {
    type: ObjectId,
    ref: 'users',
    index: true
  }
}, {
  timestamps: true
})
schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
module.exports = mongoose.model('oauths', schema)
