import { v4 as uuid } from 'uuid'
import cookies from 'js-cookie'
import DeviceDetector from './device-detector'
import HistoryPatch from './history-patch'

class TrackingService {
  constructor (store) {
    const self = this
    this.store = store
    this.detector = new DeviceDetector()
    this.historyPatch = new HistoryPatch() // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
    this.os = this.detector.getOs()
    this.browser = this.detector.getBrowser()
    this.deviceId = cookies.get('device_id')
    if (!this.deviceId) {
      this.deviceId = uuid()
      cookies.set('device_id', this.deviceId, { expires: 365 * 18 })
    }
    window.addEventListener('locationchange', () => {
      self.openVisit()
    })
  }

  connectionUpdate () {
    const payload = {
      device_id: this.deviceId,
      os: {
        name: this.os.name,
        version: this.os.version
      },
      browser: {
        name: this.browser.name,
        version: this.browser.version,
        is_mobile: this.browser.isMobileDevice
      }
    }
    this.store.dispatch('api/auth/connectionUpdate', payload)
  }

  openVisit () {
    const payload = {
      url: window.location.href,
      referrer: document.referrer
    }
    this.store.dispatch('api/visit/openVisit', payload)
  }
}

export default TrackingService
