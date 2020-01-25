const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const config = require('../../config')
const statuses = config.dataSettings.user_connection.statuses
const defaults = config.dataSettings.user_connection.defaults

const schema = new Schema({
  conn_id: {
    type: String,
    required: 'ConnIdIsRequired',
    maxlength: 40,
    index: true
  },
  process_name: {
    type: String,
    required: 'ProcessNameIsRequired',
    maxlength: 50,
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
  ip_address: {
    type: String,
    required: true,
    maxlength: 50,
    index: true
  },
  country_code: {
    type: String,
    maxlength: 3,
    index: true
  },
  country_name: {
    type: String,
    maxlength: 30
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
module.exports = mongoose.model('user_connections', schema)
