
import * as uuid from 'uuid/v4'

export const toSessionDTO = (url, iceServers, plugins) => {
  return {
    id: uuid(),
    url,
    iceServers,
    plugins,
    session: null,
    handleDTOs: []
  }
}
