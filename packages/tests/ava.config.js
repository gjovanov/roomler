let files = ['**/*.spec.js']
if (process.env.TEST === 'api') {
  files = ['api/**/*.spec.js']
}
if (process.env.TEST === 'ui') {
  files = ['ui/**/*.spec.js']
}
if (process.env.TEST === 'e2e') {
  files = ['e2e/**/*.spec.js']
}

export default {
  files,
  cache: true,
  concurrency: 64,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true
}
