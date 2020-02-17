const stripe = window.Stripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)

export const checkout = async skus => {
  const response = await fetch("/.netlify/functions/createCheckout", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skuIds: skus.map(skus => skus.id) }),
  })
  const data = await response.json()
  return stripe.redirectToCheckout({
    sessionId: data.id,
  })
}

export const redirectToCheckout = async skus =>
  await stripe.redirectToCheckout({
    items: skus.map(sku => ({
      sku: sku.id,
      quantity: 1,
    })),
    successUrl: `http://localhost:8000/page-2/`,
    cancelUrl: `http://localhost:8000/advanced`,
    billingAddressCollection: `required`,
  })
