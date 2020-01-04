const facebookOptions = require('./facebook-options')
const googleOptions = require('./google-options')
const githubOptions = require('./github-options')
const linkedinOptions = require('./linkedin-options')

module.exports = {
  facebook: facebookOptions.credentials.client.id ? facebookOptions : undefined,
  google: googleOptions.credentials.client.id ? googleOptions : undefined,
  github: githubOptions.credentials.client.id ? githubOptions : undefined,
  linkedin: linkedinOptions.credentials.client.id ? linkedinOptions : undefined
}
