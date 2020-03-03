import React, { useContext } from 'react'
import { checkout } from '../../stripe/checkout'
import { CartContext } from './cart'
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons'
import { Badge, Button } from 'antd'
import styles from './cartButton2.module.less'
import cx from 'classnames'

const CartButton = () => {
  const { items, empty } = useContext(CartContext) || {
    items: [],
    empy: () => {}
  }
  return (
    <>
      <Badge count={items.length}>
        <ShoppingCartOutlined
          className={styles.cart}
          onClick={items.length && (() => checkout(items))}
          type="shopping-cart"
        />
      </Badge>
      <DeleteOutlined
        className={cx(styles.delete, {
          [styles.hide]: !items.length
        })}
        onClick={empty}
        type="delete"
      />
    </>
  )
}

export default CartButton
