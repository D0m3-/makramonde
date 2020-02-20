import React, { useContext } from "react"
import { checkout } from "../../stripe/checkout"
import { CartContext } from "./cart"

const CartButton = () => {
  const { items, empty } = useContext(CartContext) || {
    items: [],
    empy: () => {},
  }
  return (
    <div>
      <p>{items.length} in the cart</p>
      <button onClick={() => checkout(items)}>checkout</button>
      <button onClick={empty}>vider</button>
    </div>
  )
}

export default CartButton
