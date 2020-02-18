const stripe =
  typeof window !== "undefined" &&
  window.Stripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)

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
