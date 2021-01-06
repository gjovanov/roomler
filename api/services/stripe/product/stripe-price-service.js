const Stripe = require('stripe')
const config = require('../../../../config')

class StripePriceService {
  constructor () {
    this.stripe = Stripe(config.stripeSettings.secret)
  }

  async create (payload) {
    const result = await this.stripe.prices.create({
      unit_amount: payload.unit_amount,
      unit_amount_decimal: payload.unit_amount_decimal,
      currency: payload.currency,
      recurring: payload.recurring,
      billing_scheme: payload.billing_scheme,
      tiers: payload.tiers,
      tiers_mode: payload.tiers_mode,
      product: payload.product,
      metadata: payload.metadata
    })
    return result
  }

  async get (id) {
    const result = await this.stripe.prices.retrieve(
      id
    )
    return result
  }

  async getAll (payload = { limit: 10 }) {
    const result = await this.stripe.prices.list({
      ids: payload.ids,
      limit: payload.limit,
      product: payload.product,
      currency: payload.currency,
      type: payload.type,
      created: payload.created,
      ending_before: payload.ending_before,
      starting_after: payload.starting_after
    })
    return result
  }

  async update (id, update) {
    const result = await this.stripe.prices.update(
      id,
      update
    )
    return result
  }

  async delete (id) {
    const result = await this.stripe.prices.del(
      id
    )
    return result
  }
}

module.exports = new StripePriceService()
