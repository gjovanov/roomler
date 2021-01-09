class AsteriskService {
  constructor () {
    this.ari = null
  }

  init (ari) {
    this.ari = ari
  }

  async createRecords (user) {
    const aor = {
      configClass: 'res_pjsip',
      objectType: 'aor',
      id: user._id,
      fields: [
        { attribute: 'max_contacts', value: '1' },
        { attribute: 'remove_existing', value: 'yes' }
      ]
    }
    await this.ari.asterisk.updateObject(aor)

    const auth = {
      configClass: 'res_pjsip',
      objectType: 'auth',
      id: user._id,
      fields: [
        { attribute: 'auth_type', value: 'userpass' },
        { attribute: 'username', value: `${user._id}` },
        { attribute: 'password', value: `${user.createdAt.getTime()}` }
      ]
    }
    await this.ari.asterisk.updateObject(auth)

    const endpoint = {
      configClass: 'res_pjsip',
      objectType: 'endpoint',
      id: user._id,
      fields: [
        { attribute: 'aors', value: `${user._id}` },
        { attribute: 'auth', value: `${user._id}` },
        { attribute: 'context', value: 'roomler-main' },
        { attribute: 'direct_media', value: 'no' },
        { attribute: 'rtp_symmetric', value: 'yes' },
        { attribute: 'force_rport', value: 'yes' },
        { attribute: 'rtp_timeout', value: '30' },
        { attribute: 'device_state_busy_at', value: '1' },
        { attribute: 'call_group', value: '1' },
        { attribute: 'pickup_group', value: '1' },
        { attribute: 'moh_suggest', value: 'default' },
        { attribute: 'disallow', value: 'all' },
        { attribute: 'allow', value: 'opus' },
        { attribute: 'allow', value: 'alaw' },
        { attribute: 'allow', value: 'ulaw' },
        { attribute: 'allow', value: 'vp8' },
        { attribute: 'rewrite_contact', value: 'yes' }
      ]
    }
    await this.ari.asterisk.updateObject(endpoint)
  }
}

module.exports = new AsteriskService()
