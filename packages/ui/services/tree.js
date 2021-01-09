export default class Tree {
  constructor (rooms) {
    this.init(rooms)
  }

  init (rooms) {
    this.rooms = rooms
    this.rooms.forEach((room) => { room.children = [] })
    this.open = []
    this.active = []
    this.items = this.getRootItems(this.rooms)
    this.buildTree(this.rooms, this.items)
  }

  getRootItems (rooms) {
    const result = []
    rooms.forEach((room) => {
      if (!room.children) {
        room.children = []
      }
      const names = room.name.split('.')

      const parent = rooms.find(p => p._id !== room._id && room.path.startsWith(`${p.path}.`))
      if (!parent) {
        room.short_name = room.name
        room.is_root = true
        result.push(room)
      } else {
        room.short_name = names[names.length - 1]
      }
    })
    return result
  }

  buildTree (rooms, parentRooms) {
    const self = this
    parentRooms.forEach((parentRoom) => {
      const children = rooms.filter(r => r._id !== parentRoom._id && r.path.startsWith(`${parentRoom.path}.`))
      children.forEach((childRoom) => {
        const childParents = rooms.filter(r => r._id !== childRoom._id && childRoom.path.startsWith(`${r.path}.`))
          .sort((a, b) => b.path.length - a.path.length)
        if (childParents && childParents.length && childParents[0]._id === parentRoom._id) {
          childRoom.short_name = childRoom.name.replace(`${parentRoom.name}.`, '')
          childRoom.is_root = false
          parentRoom.children.push(childRoom)
        }
      })
      self.buildTree(rooms, parentRoom.children)
    })
  }
}
