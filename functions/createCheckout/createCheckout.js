const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const contentful = require('contentful')
const Shipping = require('./constants/shipping')

const contentfulClient = contentful.createClient({
  space: `lqbvqzcpaex7`,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.GATSBY_STRIPE_ENV === 'test' ? 'test' : 'master'
})

exports.handler = async function(event, context, callback) {
  const { origin, referer } = event.headers
  const incoming = JSON.parse(event.body)
  const { products } = incoming
  try {
    const skus = await getProducts({ products })
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

async function getProducts({ products }) {
  return await Promise.all(
    products.map(async ({ id, from }) => {
      if (from === 'stripe') {
        const sku = await stripe.skus.retrieve(id)
        const product = await stripe.products.retrieve(sku.product)
        return {
          name: product.name,
          amount: sku.price,
          currency: sku.currency,
          ...(sku.image && { images: [sku.image] }) //TODO fix image for checkout
        }
      } else if (from === 'contentful') {
        const product = await contentfulClient.getEntry(id)
        return {
          name: product.fields.title,
          amount: product.fields.price * 100,
          currency: 'EUR'
        }
      }
    })
  )
}

async function createCheckout({ skus, origin, referer, shippingId }) {
  const items = skus.map(sku => ({
    ...sku,
    quantity: 1
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
    line_items: items,
    shipping_address_collection: {
      allowed_countries: ['FR']
    }
  })
  return session
}
