const mongoose = require('mongoose')
const config = require('roomler.config')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const statuses = config.dataSettings.connection.statuses
const defaults = config.dataSettings.connection.defaults

const schema = new Schema({
  conn_id: {
    type: String,
    required: 'ConnIdIsRequired',
    maxlength: 40,
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
    maxlength: 50
  },
  user: {
    type: ObjectId,
    ref: 'users',
    index: true
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
  timestamps: true
})

schema.index({ createdAt: 1 }) // connection start
schema.index({ updatedAt: 1 }) // connection end (if status = closed)
schema.index({ status: 1 }, { partialFilterExpression: { status: 'open' } })
module.exports = mongoose.model('connections', schema)
