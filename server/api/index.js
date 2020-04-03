if (!!process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
const apiServier = require('./api-server')
apiServier.up()
