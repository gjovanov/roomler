let defaultDbUrl = 'mongodb://localhost:27017/roomdb'
if (process.env.NODE_ENV === 'test') {
  defaultDbUrl += `_${process.env.NODE_ENV}_${process.env.TEST}`
}
module.exports = {
  dbUrl: process.env.DB_CONN || defaultDbUrl,
  dbOptions: {
    family: 4,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: process.env.NODE_ENV !== 'test',
    keepAlive: true,
    keepAliveInitialDelay: 300000
    // reconnectTries: 20
  }
}
