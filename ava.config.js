let files = ['tests/**/*.spec.js']
if (process.env.TEST_TYPE === 'api') {
  files = ['tests/api/**/*.spec.js']
}
if (process.env.TEST_TYPE === 'ui') {
  files = ['tests/ui/**/*.spec.js']
}

export default {
  files,
  cache: true,
  concurrency: 16,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true
}
