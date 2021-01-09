const { performance, PerformanceObserver } = require('perf_hooks')
const consola = require('consola')

class PerformanceService {
  constructor () {
    this.observer = new PerformanceObserver((items) => {
      items.getEntries().forEach((item) => {
        consola.info(`${item.name} ${item.duration}`)
      })
    })
    this.observer.observe({ entryTypes: ['measure'] })
    this.performance = performance
  }
}

module.exports = new PerformanceService()
