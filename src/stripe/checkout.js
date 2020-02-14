const stripe = window.Stripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)

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
