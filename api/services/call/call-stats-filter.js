class CallStatsFilter {
  constructor (filter) {
    this.aggregate = []
    const page = filter.page || 0
    const size = filter.size || 0
    const interval = filter.interval || 'daily'
    const pageInt = parseInt(page)
    const sizeInt = parseInt(size)
    const $match = { $and: [] }
    const $match1 = { $and: [] }
    const $match2 = { $and: [] }
    const $match3 = { $and: [] }
    if (filter.from || filter.to) {
      const dateFilter = { createdAt: { } }
      if (filter.from) {
        dateFilter.createdAt.$gte = new Date(filter.from)
      }
      if (filter.to) {
        // less than To Date + 1 day
        const to = new Date(filter.to)
        const copy = new Date(Number(to))
        copy.setDate(to.getDate() + 1)
        dateFilter.createdAt.$lt = copy
      }
      $match.$and.push(dateFilter)
    }
    if (filter.status) {
      $match.$and.push({ status: filter.status })
    }
    if (filter.os) {
      $match1.$and.push({ 'connection.os.name': filter.os })
    }
    if (filter.browser) {
      $match1.$and.push({ 'connection.browser.name': filter.browser })
    }
    if (filter.country) {
      $match1.$and.push({ 'connection.geoip.country.code': filter.country })
    }
    if (filter.device) {
      $match1.$and.push({ 'connection.device_id': filter.device })
    }

    if (filter.user) {
      $match2.$and.push({ 'user.username': filter.user })
    }

    if (filter.room) {
      $match3.$and.push({ 'room.name': filter.room })
    }

    const $lookup1 = {
      from: 'connections',
      let: { connectionId: '$connection' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$connectionId'] } } }
      ],
      as: 'connection'
    }
    const $lookup2 = {
      from: 'users',
      let: { userId: '$user' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } }
      ],
      as: 'user'
    }
    const $lookup3 = {
      from: 'rooms',
      let: { roomId: '$room' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$roomId'] } } }
      ],
      as: 'room'
    }

    if ($match.$and.length) {
      this.aggregate.push({ $match })
    }
    this.aggregate.push({ $lookup: $lookup1 })
    this.aggregate.push({ $unwind: '$connection' })
    if ($match1.$and.length) {
      this.aggregate.push({ $match: $match1 })
    }

    this.aggregate.push({ $lookup: $lookup2 })
    this.aggregate.push({ $unwind: '$user' })
    if ($match2.$and.length) {
      this.aggregate.push({ $match: $match2 })
    }

    this.aggregate.push({ $lookup: $lookup3 })
    this.aggregate.push({ $unwind: '$room' })
    if ($match3.$and.length) {
      this.aggregate.push({ $match: $match3 })
    }

    const $addFields = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      week: { $week: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' },
      duration: {
        $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 1000 * 60]
      }
    }
    this.aggregate.push({ $addFields })
    this.aggregate.push({ $sort: { createdAt: -1 } })
    const $facet = {
      data: [
        { $skip: pageInt * sizeInt },
        { $limit: sizeInt }
      ],
      count: [
        { $group: { _id: null, count: { $sum: 1 } } }
      ],
      countries: [
        { $group: { _id: this.getGroupId(interval, '$geoip.country.code'), count: { $sum: 1 }, duration: { $sum: '$duration' } } }
      ],
      users: [
        { $group: { _id: this.getGroupId(interval, '$user.username'), count: { $sum: 1 }, duration: { $sum: '$duration' } } }
      ],
      os: [
        { $group: { _id: this.getGroupId(interval, '$os.name'), count: { $sum: 1 }, duration: { $sum: '$duration' } } }
      ],
      browsers: [
        { $group: { _id: this.getGroupId(interval, '$browser.name'), count: { $sum: 1 }, duration: { $sum: '$duration' } } }
      ],
      rooms: [
        { $group: { _id: this.getGroupId(interval, '$room.name'), count: { $sum: 1 }, duration: { $sum: '$duration' } } }
      ]
    }
    this.aggregate.push({ $facet })
  }

  getGroupId (interval, key) {
    const result = {
      year: '$year', month: '$month'
    }

    if (interval === 'weekly') {
      result.week = '$week'
    }
    if (interval === 'daily') {
      result.day = '$day'
    }
    result.key = key
    return result
  }

  getAggregate () {
    return this.aggregate
  }
}

module.exports = CallStatsFilter
