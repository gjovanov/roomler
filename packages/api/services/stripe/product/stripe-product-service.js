const Stripe = require('stripe')
const config = require('../../../../config')

class StripeProductService {
  constructor () {
    this.stripe = Stripe(config.stripeSettings.secret)
  }

  async create (payload) {
    const result = await this.stripe.products.create({
      name: payload.name,
      description: payload.description,
      metadata: payload.metadata
    })
    return result
  }

  async get (id) {
    const result = await this.stripe.products.retrieve(
      id
    )
    return result
  }

  async getAll (payload = { limit: 10 }) {
    const result = await this.stripe.products.list({
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
    const result = await this.stripe.products.update(
      id,
      update
    )
    return result
  }

  async delete (id) {
    const result = await this.stripe.products.del(
      id
    )
    return result
  }
}

module.exports = new StripeProductService()
