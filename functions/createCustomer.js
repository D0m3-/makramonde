const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

exports.handler = async function(event, context, callback) {
  const incoming = JSON.parse(event.body)
  const { stripeToken, email, productPlan } = incoming
  try {
    const data = await createCustomerAndSubscribeToPlan(
      stripeToken,
      email,
      productPlan
    )
    return respond(data)
  } catch (err) {
    return respond(err)
  }
}

const respond = fulfillmentText => {
  return {
    statusCode: 200,
    body: JSON.stringify(fulfillmentText),
    headers: {
      "Content-Type": "application/json",
    },
  }
}

async function createCustomerAndSubscribeToPlan(
  stripeToken,
  email,
  productPlan
) {
  // create a customer
  const customer = await stripe.customers.create({
    email,
    source: stripeToken,
  })
  // retrieve created customer id to add customer to subscription plan
  const customerId = customer.id
  // create a subscription for the newly created customer
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ plan: productPlan }],
  })
  return subscription
}
