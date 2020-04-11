import { message } from "antd"

const stripe =
  typeof window !== 'undefined' &&
  window.Stripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)

export const checkout = async skus => {
  try{

  
  const response = await fetch('/.netlify/functions/createCheckout', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ skuIds: skus.map(sku => sku.id) })
  })
  const data = await response.json()

  const result = await stripe.redirectToCheckout({
    sessionId: data.id,
  })
  console.log(result)
  if (result.error) {
    onError(result.error)
  }
  return result
  } catch(error){
    onError(error)
  }
}

const onError = (error) => {
  message.error('Désolé, il y a eu un problème, veuillez réessayer plus tard...');
  console.warn(error.message)
}
