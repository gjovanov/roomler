let files = ['tests/**/*.spec.js']
if (process.env.TEST === 'api') {
  files = ['tests/api/**/*.spec.js']
}
if (process.env.TEST === 'ui') {
  files = ['tests/ui/**/*.spec.js']
}
if (process.env.TEST === 'e2e') {
  files = ['tests/e2e/**/*.spec.js']
}

export default {
  require: ['./tests/setup.js', '@babel/register'],
  files,
  cache: true,
  concurrency: 16,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true
}
