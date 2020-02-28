class RoomDeleteFilter {
  constructor (options) {
    if (options.room) {
      this.filter = { $or: [{ _id: options.room._id }, { path: new RegExp(`^${options.room.path}\\.`, 'i') }] }
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = RoomDeleteFilter
