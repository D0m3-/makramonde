import React from "react"
import { checkout } from "../../stripe/checkout"

const CartButton = ({ items }) => (
  <div>
    <p>{items.length} in the cart</p>
    <button onClick={() => checkout(items)}>checkout</button>
  </div>
)

export default CartButton
