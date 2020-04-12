import React, { useContext, useState, useRef } from 'react'
import { graphql } from 'gatsby'
import { PlusCircleOutlined, ShoppingOutlined } from '@ant-design/icons'

import { formatPrice } from '../util/price'
import { CartContext } from '../components/cart/cart'
import { checkout } from '../stripe/checkout'
import { Button, Modal } from 'antd'
import styles from './product.module.less'
import SEO from '../components/seo'

import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { navigate } from 'gatsby'
import { getProductUrl } from '../util/link'

const THRESHOLD = 20
const NO_DRAG_THRESHOLD = 2 * THRESHOLD

const Product = ({
  data: {
    currentProduct,
    currentSku,
    nextProduct,
    nextSku,
    previousProduct,
    previousSku
  }
}) => {
  /**
   * @constant MutableRefObject<HTMLDivElement>
   */
  const ref = useRef()
  const [{ x }, set] = useSpring(() => ({ x: 0 }))
  const isSwiping = useRef()

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(
    ({ down, movement: [mx], swipe: [swipeX], cancel }) => {
      if (isSwiping.current) {
        return
      }
      if (swipeX) {
        isSwiping.current = true
        set({
          x: swipeX * ref.current.offsetWidth,
          onRest: () => {
            navigate(
              getProductUrl(swipeX === 1 ? previousProduct : nextProduct)
            )
          }
        })
        return
      }
      if (!previousProduct && mx > NO_DRAG_THRESHOLD) {
        cancel()
      }
      if (!nextProduct && mx < -NO_DRAG_THRESHOLD) {
        cancel()
      }

      set({ x: down ? mx : 0 })
    },
    { threshold: THRESHOLD }
  )

  return (
    <animated.div
      ref={ref}
      {...bind()}
      style={{
        position: 'relative',
        left: x
      }}
    >
      {previousProduct && (
        <div className={styles.previousContainer}>
          <ProductRaw product={previousProduct} sku={previousSku} />
        </div>
      )}
      <ProductRaw product={currentProduct} sku={currentSku} />
      {nextProduct && (
        <div className={styles.nextContainer}>
          <ProductRaw product={nextProduct} sku={nextSku} />
        </div>
      )}
    </animated.div>
  )
}

const ProductRaw = ({ product, sku }) => {
  const [image, setImage] = useState()
  const [loading, setLoading] = useState(false)

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
              loading={loading}
              icon={<ShoppingOutlined />}
              onClick={async () => {
                setLoading(true)
                await checkout([sku])
                setLoading(false)
              }}
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
        className={styles.modal}
        visible={image}
        onCancel={() => setImage()}
        footer={null}
        width="100%"
      >
        <img src={image} className={styles.imageModal} />
      </Modal>
    </div>
  )
}

export default Product

export const query = graphql`
  query($id: String!, $nextId: String, $previousId: String) {
    currentProduct: stripeProduct(id: { eq: $id }) {
      id
      images
      description
      name
      images
    }
    currentSku: stripeSku(product: { id: { eq: $id } }) {
      price
      id
      currency
    }
    nextProduct: stripeProduct(id: { eq: $nextId }) {
      id
      images
      description
      name
      images
      created
    }
    nextSku: stripeSku(product: { id: { eq: $nextId } }) {
      price
      id
      currency
    }
    previousProduct: stripeProduct(id: { eq: $previousId }) {
      id
      images
      description
      name
      images
      created
    }
    previousSku: stripeSku(product: { id: { eq: $previousId } }) {
      price
      id
      currency
    }
  }
`
