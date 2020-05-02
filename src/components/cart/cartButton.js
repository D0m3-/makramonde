import React, { useContext, useState } from 'react'
import { checkout } from '../../stripe/checkout'
import { CartContext } from './cart'
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons'
import { Badge, Spin } from 'antd'
import styles from './cartButton.module.less'
import cx from 'classnames'

const CartButton = () => {
  const [loading, setLoading] = useState(false)
  const { items, empty } = useContext(CartContext) || {
    items: [],
    empy: () => {}
  }
  return (
    <>
      {!loading && (
        <Badge count={items.length}>
          <ShoppingCartOutlined
            className={styles.cart}
            onClick={
              items.length
                ? async () => {
                    setLoading(true)
                    await checkout(items)
                    setLoading(false)
                  }
                : undefined
            }
            type="shopping-cart"
          />
        </Badge>
      )}

      {loading && <Spin />}

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
