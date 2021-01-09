const Stripe = require('stripe')
const config = require('../../../../config')

class StripeCustomerService {
  constructor () {
    this.stripe = Stripe(config.stripeSettings.secret)
  }

  async create (payload) {
    const result = await this.stripe.customers.create({
      email: payload.email,
      name: payload.name,
      description: payload.description,
      metadata: payload.metadata
    })
    return result
  }

  async get (id) {
    const result = await this.stripe.customers.retrieve(
      id
    )
    return result
  }

  async getAll (payload = { limit: 10 }) {
    const result = await this.stripe.customers.list({
      limit: payload.limit,
      created: payload.created,
      ending_before: payload.ending_before,
      starting_after: payload.starting_after
    })
    return result
  }

  async update (id, update) {
    const result = await this.stripe.customers.update(
      id,
      update
    )
    return result
  }

  async delete (id) {
    const result = await this.stripe.customers.del(
      id
    )
    return result
  }
}

module.exports = new StripeCustomerService()
