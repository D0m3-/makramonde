import React, { useContext, useState } from 'react'
import { graphql } from 'gatsby'

import { formatPrice } from '../util/price'
import { CartContext } from '../components/cart/cart'
import { checkout } from '../stripe/checkout'
import { getProductUrl } from '../util/link'
import SwipeLink from '../components/animation/swipe'
import { Row, Col, Button, Modal } from 'antd'
import styles from './product.module.less'
import SEO from '../components/seo'

const Arrow = ({ node, icon, direction }) => (
  <SwipeLink
    className={styles.arrowContainer}
    direction={direction === 'right' ? 'left' : 'right'}
    to={node && getProductUrl(node)}
  >
    <Button
      type="primary"
      ghost
      icon={direction}
      disabled={!node}
      block
      className={styles.arrow}
    ></Button>
  </SwipeLink>
)

const Product = ({ data }) => {
  const [image, setImage] = useState()
  const product = data.stripeProduct
  const sku = data.stripeSku
  const { next, previous } = data.allStripeProduct.edges.find(
    edge => edge.node.id == product.id
  )
  const { addItem } = useContext(CartContext) || { addItem: () => {} }
  return (
    <Row type="flex" align="middle" className={'full-height'}>
      <Col span={2}>
        <Arrow node={previous} direction="left" />
      </Col>
      <Col span={20}>
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
                icon="plus-circle"
                onClick={() => addItem(sku)}
              >
                panier
              </Button>
              <Button
                className={styles.marginLeft}
                type="primary"
                icon="shopping"
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
      </Col>
      <Col span={2}>
        <Arrow node={next} direction="right" />
      </Col>
      <Modal
        visible={image}
        onCancel={() => setImage()}
        footer={null}
        width="80%"
      >
        <img src={image} className={styles.imageModal} />
      </Modal>
    </Row>
  )
}

export default Product

export const query = graphql`
  query($id: String!) {
    stripeProduct(id: { eq: $id }) {
      id
      images
      description
      caption
      name
      images
    }
    stripeSku(product: { id: { eq: $id } }) {
      price
      id
      currency
    }
    allStripeProduct(
      filter: { active: { eq: true }, shippable: { eq: true } }
    ) {
      edges {
        next {
          name
          created
        }
        previous {
          name
          created
        }
        node {
          id
        }
      }
    }
  }
`
