import React, { useContext } from 'react'
import { graphql } from 'gatsby'

import { formatPrice } from '../util/price'
import { CartContext } from '../components/cart/cart'
import { checkout } from '../stripe/checkout'
import { getProductUrl } from '../util/link'
import SwipeLink from '../components/animation/swipe'
import { Row, Col, Button } from 'antd'
import styles from './product.module.less'

const Product = ({ data }) => {
  const product = data.stripeProduct
  const sku = data.stripeSku
  const { next, previous } = data.allStripeProduct.edges.find(
    edge => edge.node.id == product.id
  )
  const { addItem } = useContext(CartContext) || { addItem: () => {} }
  return (
    <Row type="flex" align="middle" className={'full-height'}>
      <Col span={2}>
        <SwipeLink
          className={styles.arrowContainer}
          direction="right"
          to={previous && getProductUrl(previous)}
        >
          <Button
            type="link"
            icon="left"
            disabled={!previous}
            block
            className={'full-height'}
          ></Button>
        </SwipeLink>
      </Col>
      <Col span={20}>
        <div className={styles.content}>
          <h1>{product.name}</h1>
          <p>{product.caption}</p>
          <p>{product.description}</p>
          <p>Price: {formatPrice(sku.price, sku.currency)}</p>
          <div className={styles.images}>
            {product.images.map(url => (
              <div key={url}>
                <img src={url} />
              </div>
            ))}
          </div>
          <button onClick={() => addItem(sku)}>Ajouter au panier</button>
          <button onClick={() => checkout([sku])}>Acheter immediatement</button>
        </div>
      </Col>
      <Col span={2}>
        <SwipeLink
          className={styles.arrowContainer}
          direction="left"
          to={next && getProductUrl(next)}
        >
          <Button
            type="link"
            icon="right"
            disabled={!next}
            block
            className={'full-height'}
          ></Button>
        </SwipeLink>
      </Col>
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
