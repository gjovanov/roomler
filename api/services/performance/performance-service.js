const { performance, PerformanceObserver } = require('perf_hooks')

class PerformanceService {
  constructor () {
    this.observer = new PerformanceObserver((items) => {
      items.getEntries().forEach((item) => {
        console.log(`${item.name} ${item.duration}`)
      })
    })
    this.observer.observe({ entryTypes: ['measure'] })
    this.performance = performance
  }
}

module.exports = new PerformanceService()
