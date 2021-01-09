class RoomRenameFilter {
  constructor (options) {
    this.oldname = options.oldname
    this.oldpath = options.oldpath

    this.newname = options.newname
    this.newpath = options.newpath

    this.filter = { path: new RegExp(`^${this.oldpath}\\.`, 'i') }
  }

  getFilter () {
    return this.filter
  }

  getUpdate () {
    return [{
      $set: {
        path: {
          $concat: [
            { $arrayElemAt: [{ $split: ['$path', this.oldpath] }, 0] },
            this.newpath,
            { $arrayElemAt: [{ $split: ['$path', this.oldpath] }, 1] }
          ]
        },
        name: {
          $concat: [
            { $arrayElemAt: [{ $split: ['$name', this.oldname] }, 0] },
            this.newname,
            { $arrayElemAt: [{ $split: ['$name', this.oldname] }, 1] }
          ]
        }
      }
    }]
  }
}

module.exports = RoomRenameFilter
