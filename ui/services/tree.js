export default class Tree {
  constructor (rooms) {
    this.rooms = rooms
    this.root = this.prepareAndExtractRoot()
    this.buildTree(this.root, this.rooms)
  }

  clearTree () {
    this.rooms.forEach((room) => {
      room.children = []
      const names = room.name.split('.')
      room.short_name = names[names.length - 1]
    })
  }

  prepareAndExtractRoot () {
    const result = []
    this.rooms.forEach((room) => {
      room.children = []
      const names = room.name.split('.')

      const parent = this.rooms.find(parent => parent._id !== room._id && room.path.startsWith(parent.path))
      if (!parent) {
        room.short_name = room.name
        result.push(room)
      } else {
        room.short_name = names[names.length - 1]
      }
    })
    return result
  }

  buildTree (upperRooms, rooms) {
    const self = this
    upperRooms.forEach((upperRoom) => {
      const lowerRooms = rooms.filter(r => r.path.startsWith(`${upperRoom.path}.`) && !`${r.path}`.replace(`${upperRoom.path}.`, '').includes('.'))
      lowerRooms.forEach((lowerRoom) => {
        upperRoom.children.push(lowerRoom)
      })
      self.buildTree(lowerRooms, rooms)
    })
  }
}
