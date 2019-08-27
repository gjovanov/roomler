import { storage } from './storage'
import { config } from '~/../config/'

export default class Headers {
  static getHeaders () {
    return {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: 'JWT ' + storage.getLocal(config.token),
      'Cache-Control': 'no-cache'
    }
  }
}
