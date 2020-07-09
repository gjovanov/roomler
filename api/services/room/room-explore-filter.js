class RoomExploreFilter {
  constructor () {
    this.filter = {
      path: { $regex: /^((?!\.).)*$/ }
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = RoomExploreFilter
