
import { v4 as uuid } from 'uuid'

export class SessionDto {
  constructor (url, iceServers, plugins) {
    this.id = uuid()
    this.url = url
    this.iceServers = iceServers
    this.plugins = plugins
    this.session = null
    this.handleDtos = []
  }
}
