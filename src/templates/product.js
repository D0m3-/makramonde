import React, { useContext, useState } from 'react'
import { graphql, Link } from 'gatsby'
import {
  PlusCircleOutlined,
  ShoppingOutlined,
  RightCircleFilled,
  LeftCircleFilled
} from '@ant-design/icons'

import { formatPrice } from '../util/price'
import { CartContext } from '../components/cart/cart'
import { checkout } from '../stripe/checkout'
import { getProductUrl } from '../util/link'
import { Row, Col, Button, Modal } from 'antd'
import styles from './product.module.less'
import SEO from '../components/seo'

const Product = ({ data }) => {
  const [image, setImage] = useState()
  const product = data.stripeProduct
  const sku = data.stripeSku
  const { addItem } = useContext(CartContext) || { addItem: () => {} }
  return (
    <div className={styles.container}>
      <SEO title={product.name} description={product.description} />
      <div className={styles.content}>
        <p>{product.description}</p>
        <div className={styles.buy}>
          <div className={styles.price}>
            <strong>Prix :</strong>
            <span className={styles.marginLeft}>
              {formatPrice(sku.price, sku.currency)}
            </span>
          </div>
          <div className={styles.buttons}>
            <Button
              type="default"
              icon={<PlusCircleOutlined />}
              onClick={() => addItem(sku)}
            >
              panier
            </Button>
            <Button
              className={styles.marginLeft}
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={() => checkout([sku])}
            >
              acheter
            </Button>
          </div>
        </div>
        <div className={styles.images}>
          {product.images.map(url => (
            <div key={url}>
              <img
                src={url}
                onClick={() => setImage(url)}
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </div>
      <Modal
        visible={image}
        onCancel={() => setImage()}
        footer={null}
        width="80%"
      >
        <img src={image} className={styles.imageModal} />
      </Modal>
    </div>
  )
}

export default Product

export const query = graphql`
  query($id: String!) {
    stripeProduct(id: { eq: $id }) {
      id
      images
      description
      name
      images
    }
    stripeSku(product: { id: { eq: $id } }) {
      price
      id
      currency
    }
  }
`
