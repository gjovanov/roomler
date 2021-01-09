
import { v4 as uuid } from 'uuid'

export class SessionDto {
  constructor (url, iceServers, plugins, asteriskUrl, user, room) {
    this.id = uuid()
    this.url = url
    this.iceServers = iceServers
    this.plugins = plugins
    this.asteriskUrl = asteriskUrl
    this.user = user
    this.room = room
    this.session = null
    this.videoroomHandles = []
    this.sipHandles = []
    this.audiobridgeHandles = []
  }
}
