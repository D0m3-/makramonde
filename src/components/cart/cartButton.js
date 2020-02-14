import React from "react"
import { redirectToCheckout } from "../../stripe/checkout"

const CartButton = ({ items }) => (
  <div>
    <p>{items.length} in the cart</p>
    <button onClick={() => redirectToCheckout(items)}>checkout</button>
  </div>
)

export default CartButton
