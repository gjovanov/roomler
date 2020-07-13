const mongoose = require('mongoose')
class VisitFilter {
  constructor (options) {
    this.aggregate = []
  }

  addMatch ($match) {
    const before = this.filter.before
    delete this.filter.before
    const match = $match
    this.aggregate.push(match)
    return this
  }

  addLookup () {
    this.aggregate.push({
      $lookup: {
        from: 'connections',
        localField: 'connection',
        foreignField: '_id',
        as: 'connection'
      }
    })
    return this
  }

  addSort ($sort) {
    this.aggregate.push({
      $sort
    })
    return this
  }

  addSkip ($skip) {
    this.aggregate.push({
      $skip
    })
    return this
  }

  addLimit ($limit) {
    this.aggregate.push({
      $limit
    })
    return this
  }

  getFilter () {
    return this.filter
  }

  getAggregate () {
    return this.aggregate
  }
}

module.exports = VisitFilter
