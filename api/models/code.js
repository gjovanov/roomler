const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../../config')
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

module.exports = mongoose.model('codes', schema)
