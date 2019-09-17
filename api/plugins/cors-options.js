const config = require('../../config')
const options = {
  // preflight: true,
  // preflightContinue: true,
  // optionsSuccessStatus: 200,
  // credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  // allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
}
console.log(options)
module.export = options
