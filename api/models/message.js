const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const config = require('../../config')
const types = config.dataSettings.message.types

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
  type: {
    type: String,
    required: 'TypeIsRequired',
    enum: types,
    default: 'text'
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
  reactions: [{
    user: {
      type: ObjectId,
      ref: 'users',
      index: true
    },
    type: {
      type: String,
      required: 'ReactionTypeIsRequired'
    },
    reaction: {
      type: Object,
      required: 'ReactionIsRequired'
    }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('messages', schema)
