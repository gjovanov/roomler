if (!!process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
const uiServier = require('./ui-server')
uiServier.up()
