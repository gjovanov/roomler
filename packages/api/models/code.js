const mongoose = require('mongoose')
const config = require('roomler.config')
const Schema = mongoose.Schema
const codeTypes = config.dataSettings.code.types

const schema = new Schema({
  username: {
    type: String,
    required: 'UsernameRequired',
    index: true
  },
  token: {
    type: String,
    required: 'CodeRequired',
    index: true
  },
  type: {
    type: String,
    required: 'TypeIsRequired',
    enum: codeTypes
  },
  validto: {
    type: Date
  }
}, {
  timestamps: true
})
schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
module.exports = mongoose.model('codes', schema)
