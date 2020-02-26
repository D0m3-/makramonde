import React, { useContext } from 'react'
import { checkout } from '../../stripe/checkout'
import { CartContext } from './cart'
import { Icon, Badge, Button } from 'antd'

const CartButton = () => {
  const { items, empty } = useContext(CartContext) || {
    items: [],
    empy: () => {}
  }
  return (
    <>
      <Badge count={items.length}>
        <Button
          onClick={() => checkout(items)}
          type="link"
          icon="shopping-cart"
          size="large"
        ></Button>
      </Badge>
      {items.length && (
        <Button onClick={empty} type="link" icon="delete"></Button>
      )}
    </>
  )
}

export default CartButton
