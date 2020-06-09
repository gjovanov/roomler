const consola = require('consola')
const maxmind = require('maxmind')
const config = require('../../../config')
const performanceService = require('../../services/performance/performance-service')

class GeoIpService {
  async init () {
    const mmdbPath = config.geoipSettings.mmdbPath
    performanceService.performance.mark('MmdbOpen start')
    const db = await maxmind.open(mmdbPath, {
      watchForUpdates: true,
      watchForUpdatesHook: () => {
        consola.info('MMDB update')
      }
    })
    performanceService.performance.mark('MmdbOpen end')
    performanceService.performance.measure('MmdbOpen', 'MmdbOpen start', 'MmdbOpen end')
    return db
  }

  async get (ipAddress) {
    if (!this.db) {
      this.db = await this.init()
    }
    performanceService.performance.mark('MmdbLookup start')
    const lookup = await this.db.get(ipAddress)
    performanceService.performance.mark('MmdbLookup end')
    performanceService.performance.measure('MmdbLookup', 'MmdbLookup start', 'MmdbLookup end')
    return this.toDto(lookup)
  }

  toDto (lookup) {
    if (lookup) {
      const result = {}
      if (lookup.continent) {
        result.continent = {
          code: lookup.continent.code,
          name: lookup.continent.names.en
        }
      }
      if (lookup.country) {
        result.country = {
          code: lookup.country.iso_code,
          name: lookup.country.names.en,
          is_eu: lookup.country.is_in_european_union
        }
      }
      if (lookup.city) {
        result.city_name = lookup.city.names.en
      }
      return result
    }
    return null
  }
}

module.exports = new GeoIpService()
