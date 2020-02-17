const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.handler = async function(event, context, callback) {
  const incoming = JSON.parse(event.body)
  const { skuIds } = incoming
  try {
    const skus = await getSkus({ skuIds })
    console.log("skus ", skus)
    console.log("type ", typeof skus)
    const data = await createCheckout({ skus })
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
      "Content-Type": "application/json",
    },
  }
}

async function getSkus({ skuIds }) {
  console.log("get skus ", skuIds)
  return await Promise.all(skuIds.map(async id => stripe.skus.retrieve(id)))
}

async function createCheckout({ skus }) {
  console.log("begin checkout session")
  const items = skus.map(sku => ({
    name: sku.attributes.name,
    amount: sku.price,
    currency: sku.currency,
    quantity: 1,
    ...(sku.image && { images: [sku.image] }),
  }))
  console.log("items ", items)
  // create a session
  const session = await stripe.checkout.sessions.create({
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
    payment_method_types: ["card"],
    line_items: items,
  })
  return session
}
