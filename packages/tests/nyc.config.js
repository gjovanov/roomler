let include = ['tests/**/*.spec.js']
if (process.env.TEST === 'api') {
  include = [
    'api/**/*.js'
  ]
}
if (process.env.TEST === 'ui') {
  include = [
    'ui/**/*.vue',
    'ui/**/*.js',
    '.nuxt/dist/**/*.js'
  ]
}
if (process.env.TEST === 'e2e') {
  include = [
    'ui/**/*.vue',
    'ui/**/*.js',
    '.nuxt/dist/**/*.js'
  ]
}

module.exports = {
  'per-file': true,
  lines: 25,
  statements: 25,
  functions: 10,
  branches: 35,
  'check-coverage': false,
  include,
  exclude: ['node_modules'],
  extension: [
    '.js',
    '.vue'
  ],
  reporter: [
    'lcov',
    'text'
  ],
  sourceMap: false,
  cache: true,
  all: true
}
