import React, { useContext } from 'react'
import { checkout } from '../../stripe/checkout'
import { CartContext } from './cart'
import { Icon, Badge, Button } from 'antd'
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
        <Icon
          className={styles.cart}
          onClick={items.length && (() => checkout(items))}
          type="shopping-cart"
        ></Icon>
      </Badge>
      <Icon
        className={cx(styles.delete, {
          [styles.hide]: !items.length
        })}
        onClick={empty}
        type="delete"
      ></Icon>
    </>
  )
}

export default CartButton
