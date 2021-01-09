const webpush = require('web-push')
const cheerio = require('cheerio')
const Subscription = require('../../models/subscription')
const config = require('roomler.config')
const SubscriptionFilter = require('./subscription-filter')

class SubscriptionService {
  constructor () {
    try {
      webpush.setVapidDetails(config.webPushSettings.contact, config.webPushSettings.publicKey, config.webPushSettings.privateKey)
    } catch (e) {
      console.log(`ERROR: ${e}`)
    }
  }

  async create (userid, data) {
    data.user = userid
    let record = new Subscription(data)
    record = await record.save()
    return record
  }

  async getAll (users) {
    const subscriptionFilter = new SubscriptionFilter({
      users
    })
      .getFilter()
    const record = await Subscription
      .find(subscriptionFilter)
      .exec()
    return record
  }

  async delete (userid, subscription) {
    subscription.user = userid
    const result = await Subscription
      .deleteOne(subscription)
      .exec()
    if (!result.deletedCount) {
      throw new ReferenceError('Subscription was not found.')
    }
    return result
  }

  async send (subscription, content) {
    if (content) {
      const $ = cheerio.load(content)
      const text = cheerio.text($('body'))
      await webpush.sendNotification(subscription, text, {})
    }
  }
}

module.exports = new SubscriptionService()
