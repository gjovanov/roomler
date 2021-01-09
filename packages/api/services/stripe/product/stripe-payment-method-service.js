const Stripe = require('stripe')
const config = require('../../../../config')

class StripePaymentMethodService {
  constructor () {
    this.stripe = Stripe(config.stripeSettings.secret)
  }

  async create (payload) {
    const result = await this.stripe.paymentMethods.create({
      type: payload.type,
      customer: payload.customer,
      billing_details: payload.billing_details,
      card: payload.card,
      metadata: payload.metadata
    })
    return result
  }

  async get (id) {
    const result = await this.stripe.paymentMethods.retrieve(
      id
    )
    return result
  }

  async getAll (payload = { limit: 10 }) {
    const result = await this.stripe.paymentMethods.list({
      ids: payload.ids,
      limit: payload.limit,
      created: payload.created,
      ending_before: payload.ending_before,
      starting_after: payload.starting_after,
      shippable: payload.shippable,
      url: payload.url
    })
    return result
  }

  async update (id, update) {
    const result = await this.stripe.paymentMethods.update(
      id,
      update
    )
    return result
  }

  async delete (id) {
    const result = await this.stripe.paymentMethods.del(
      id
    )
    return result
  }
}

module.exports = new StripePaymentMethodService()
