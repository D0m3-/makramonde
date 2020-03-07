const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Shipping = require('./constants/shipping')

exports.handler = async function(event, context, callback) {
  const { origin, referer } = event.headers
  const incoming = JSON.parse(event.body)
  const { skuIds } = incoming
  try {
    const skus = await getSkus({ skuIds })
    const data = await createCheckout({ skus, origin, referer })
    return respond({ id: data.id })
  } catch (err) {
    console.log(err)
    return respond(err)
  }
}

const respond = fulfillmentText => {
  return {
    statusCode: 200,
    body: JSON.stringify(fulfillmentText),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

async function getSkus({ skuIds }) {
  return await Promise.all(
    skuIds.map(async id => {
      const sku = await stripe.skus.retrieve(id)
      const product = await stripe.products.retrieve(sku.product)
      return {
        ...sku,
        product
      }
    })
  )
}

async function createCheckout({ skus, origin, referer, shippingId }) {
  const items = skus.map(sku => ({
    name: sku.product.name,
    amount: sku.price,
    currency: sku.currency,
    quantity: 1,
    ...(sku.image && { images: [sku.image] })
  }))

  // Add shipping line
  const totalAmount = skus.reduce((total, sku) => total + sku.price, 0)
  const shipping = Shipping.SHIPPING[shippingId || Shipping.FRANCE_METRO]
  const isDiscount = totalAmount >= shipping.discountFrom
  items.push({
    name: (isDiscount && shipping.descriptionDiscount) || shipping.description,
    amount: (isDiscount && 1) || shipping.amount,
    currency: shipping.currency,
    quantity: 1
  })
  // create a session
  const session = await stripe.checkout.sessions.create({
    success_url: `${origin}/success/`,
    cancel_url: referer,
    payment_method_types: ['card'],
    line_items: items
  })
  return session
}
