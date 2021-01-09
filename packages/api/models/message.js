const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const config = require('roomler.config')
const types = config.dataSettings.message.types
const defaults = config.dataSettings.message.defaults

const schema = new Schema({
  author: {
    type: ObjectId,
    ref: 'users',
    required: 'AuthorIsRequired',
    index: true
  },
  room: {
    type: ObjectId,
    ref: 'rooms',
    required: 'RoomIsRequired',
    index: true
  },
  client_id: {
    type: String,
    required: 'ClientIdIsRequired'
  },
  type: {
    type: String,
    required: 'TypeIsRequired',
    enum: types,
    default: defaults.type
  },
  content: {
    type: String,
    required: 'ContentIsRequired'
  },
  parent: {
    type: ObjectId,
    ref: 'messages',
    index: true
  },
  mentions: [{
    type: ObjectId,
    ref: 'users',
    index: true
  }],
  readby: [{
    type: ObjectId,
    ref: 'users',
    index: true
  }],
  reactions: [{
    user: {
      type: ObjectId,
      required: 'ReactionUserIsRequired',
      ref: 'users',
      index: true
    },
    name: {
      type: String,
      required: 'ReactionTypeIsRequired',
      maxlength: 20
    },
    symbol: {
      type: String,
      required: 'SymbolIsRequired',
      maxlength: 2
    }
  }],
  files: [{
    filename: {
      type: String,
      required: 'Filename is required'
    },
    href: {
      type: String,
      required: 'href is required'
    }
  }]
}, {
  timestamps: true
})
schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
module.exports = mongoose.model('messages', schema)
