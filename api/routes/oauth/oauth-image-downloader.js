const {
  join
} = require('path')
const fs = require('fs')
const request = require('request')

// folders
const staticFolder = join(__dirname, '../../../ui/static')
const uploadsFolder = join(staticFolder, 'uploads')

class OAuthImageDownloader {
  download (url, dest, cb) {
    return new Promise((resolve, reject) => {
      const filename = `${dest}_${Date.now()}.jpg`
      const file = fs.createWriteStream(join(uploadsFolder, filename))
      const sendReq = request.get(url)

      // verify response code
      sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
        // eslint-disable-next-line standard/no-callback-literal
          const error = 'Response status was ' + response.statusCode
          reject(error)
          return cb(error)
        }

        sendReq.pipe(file)
      })

      // close() is async, call cb after close completes
      file.on('finish', () => {
        file.close(cb)
        resolve(`/uploads/${filename}`)
      })

      // check for request errors
      sendReq.on('error', (err) => {
        fs.unlink(dest)
        reject(err)
        return cb(err.message)
      })

      file.on('error', (err) => { // Handle errors
        fs.unlink(dest) // Delete the file async. (But we don't check the result)
        reject(err)
        return cb(err.message)
      })
    })
  }
}

module.exports = new OAuthImageDownloader()
