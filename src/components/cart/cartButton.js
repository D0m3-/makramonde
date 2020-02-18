import React from "react"
import { checkout } from "../../stripe/checkout"

const CartButton = ({ items, onClear }) => (
  <div>
    <p>{items.length} in the cart</p>
    <button onClick={() => checkout(items)}>checkout</button>
    <button onClick={onClear}>vider</button>
  </div>
)

export default CartButton
