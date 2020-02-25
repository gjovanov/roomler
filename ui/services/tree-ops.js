class TreeOps {
  buildTree (rooms) {
    const rootNodes = this.getRootNodes(rooms)
    this.buildChildrenNodes(rooms, rootNodes)
    return rootNodes
  }

  getRootNodes (rooms) {
    const result = []
    rooms.forEach((room) => {
      room.children = []
      const names = room.name.split('.')

      const parent = rooms.find(parent => parent._id !== room._id && room.path.startsWith(parent.path))
      if (!parent) {
        room.short_name = room.name
        result.push(room)
      } else {
        room.short_name = names[names.length - 1]
      }
    })
    return result
  }

  buildChildrenNodes (rooms, upperRooms) {
    const self = this
    upperRooms.forEach((upperRoom) => {
      const lowerRooms = rooms.filter(r => r.path.startsWith(`${upperRoom.path}.`) && !`${r.path}`.replace(`${upperRoom.path}.`, '').includes('.'))
      lowerRooms.forEach((lowerRoom) => {
        upperRoom.children.push(lowerRoom)
      })
      self.buildChildrenNodes(rooms, lowerRooms)
    })
  }

  push (rootRooms, room) {
    const parent = this.findParent(rootRooms, room)
    const items = parent && parent.children ? parent.children : rootRooms
    let pushed = false
    for (let i = 0; i < items.length; i++) {
      const compare = items[i].path.localeCompare(room.path)
      if (compare > 0) {
        items.splice(i, 0, room)
        pushed = true
        break
      } else if (compare === 0 || room._id === items[i]._id) {
        room.children = items[i].children
        items.splice(i, 1, room)
        pushed = true
        break
      }
    }
    if (!pushed) {
      items.push(room)
    }
  }

  findParent (rootRooms, room) {
    if (rootRooms && rootRooms.length && room) {
      const names = room.name.split('.')
      room.short_name = names[names.length - 1]
      if (!room.children) {
        room.children = []
      }
      if (names.length) {
        names.pop()
      }

      const parentpath = names.join('.')
      return this.findItem(rootRooms, parentpath)
    }
    return null
  }

  findItem (rootRooms, roompath) {
    return rootRooms.reduce((acc, item) => {
      if (acc) {
        return acc
      }

      if (item.path === roompath) {
        return item
      }

      if (item.children) {
        return this.findItem(item.children, roompath)
      }

      return acc
    }, null)
  }
}

export const treeOps = new TreeOps()
