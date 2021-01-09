let defaultDbUrl = 'mongodb://localhost:27017/roomdb'
const isTest = process.env.NODE_ENV === 'test'
if (isTest) {
  defaultDbUrl += `_${process.env.NODE_ENV}_${process.env.TEST}`
}
module.exports = {
  dbUrl: !isTest ? (process.env.DB_CONN || defaultDbUrl) : defaultDbUrl,
  dbOptions: {
    family: 4,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // process.env.NODE_ENV !== 'test',
    keepAlive: true
    // ,
    // keepAliveInitialDelay: 300000
    // reconnectTries: 20
  }
}
