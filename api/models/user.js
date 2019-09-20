const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const schema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 50,
    index: true,
    unique: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    minlength: 5,
    maxlength: 255,
    index: true
  },
  password: {
    type: String,
    select: false
  },
  is_active: {
    type: Boolean,
    default: false
  },
  person: {
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    imageUrl: {
      type: String
    }
  }
}, {
  timestamps: true
})

const hashPassword = function (user, password, next) {
  const SALT_FACTOR = 10
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
}

schema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  hashPassword(user, user.password, next)
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  const password = user.$set.password || user.password
  if (!password) {
    return next()
  }
  hashPassword(user, password, next)
})

schema.methods.comparePassword = function (password) {
  const self = this
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, self.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }
      resolve(isMatch)
    })
  })
}

module.exports = mongoose.model('users', schema)
