const facebookOptions = require('./facebook-options')
const githubOptions = require('./github-options')
const linkedinOptions = require('./linkedin-options')

module.exports = {
  facebook: facebookOptions.credentials.client.id ? facebookOptions : undefined,
  github: githubOptions.credentials.client.id ? githubOptions : undefined,
  linkedin: linkedinOptions.credentials.client.id ? linkedinOptions : undefined
}
