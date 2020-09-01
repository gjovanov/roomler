
import { v4 as uuid } from 'uuid'

export const toSessionDTO = (url, iceServers, plugins) => {
  return {
    id: uuid(),
    url,
    iceServers,
    plugins,
    session: null,
    videoroomHandles: [],
    sipHandles: [],
    audiobridgeHandles: []
  }
}
