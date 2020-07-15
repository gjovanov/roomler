const mongoose = require('mongoose')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const statuses = config.dataSettings.visit.statuses
const defaults = config.dataSettings.visit.defaults

const schema = new Schema({
  connection: {
    type: ObjectId,
    ref: 'connections',
    index: true
  },
  url: {
    type: String,
    required: 'UrlIsRequired',
    index: true
  },
  referrer: {
    type: String,
    default: '',
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
  timestamps: true
})

schema.index({ createdAt: 1 }) // visit start
schema.index({ updatedAt: 1 }) // visit end
schema.index({ status: 1 }, { partialFilterExpression: { status: 'open' } })
module.exports = mongoose.model('visits', schema)
