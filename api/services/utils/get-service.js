const sget = require('simple-get')

class GetService {
  get (options) {
    return new Promise((resolve, reject) => {
      sget.concat(options, function (err, res, data) {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }
}

module.exports = new GetService()
