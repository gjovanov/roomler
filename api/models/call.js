const mongoose = require('mongoose')
const config = require('../../config')
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
  },
  ip_address: {
    type: String,
    required: true,
    maxlength: 50
  },
  geoip: {
    continent: {
      code: {
        type: String,
        maxlength: 3
      },
      name: {
        type: String,
        maxlength: 50
      }
    },
    country: {
      code: {
        type: String,
        maxlength: 3,
        index: true,
        sparse: true
      },
      name: {
        type: String,
        maxlength: 50
      },
      is_eu: {
        type: Boolean
      }
    },
    city_name: {
      type: String,
      maxlength: 50
    }
  },
  device_id: {
    type: String,
    maxlength: 40,
    index: true,
    sparse: true
  },
  os: {
    name: {
      type: String,
      maxlength: 20,
      index: true,
      sparse: true
    },
    version: {
      type: String,
      maxlength: 20
    }
  },
  browser: {
    name: {
      type: String,
      maxlength: 20,
      index: true,
      sparse: true
    },
    version: {
      type: String,
      maxlength: 20
    },
    is_mobile: {
      type: Boolean
    }
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
