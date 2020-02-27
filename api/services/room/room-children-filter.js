class RoomChildrenFilter {
  constructor (options) {
    this.userid = options.userid
    this.records = options.records
    this.paths = this.records.map(r => new RegExp(`^${r.path}\\.`, 'i'))
    this.filter = {
      $and: [
        { path: { $in: this.paths } },
        {
          $nor: [
            { owner: this.userid },
            { members: this.userid },
            { moderators: this.userid }]
        },
        { is_open: true }
      ]
    }
  }

  getFilter () {
    return this.filter
  }
}

module.exports = RoomChildrenFilter
