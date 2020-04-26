import React, { useContext, useState, useRef, useEffect } from 'react'
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
import SwipeLink, { SwipeSpring } from '../components/animation/swipe'

const THRESHOLD = 20
const NO_DRAG_THRESHOLD = 2 * THRESHOLD

const SwipableProduct = props => {
  return (
    <div
      style={{
        overflow: 'hidden'
      }}
    >
      <SwipeSpring>
        {({ transitioning }) => (
          <Product {...props} transitioning={transitioning} />
        )}
      </SwipeSpring>
    </div>
  )
}

const Product = ({
  data: {
    currentProduct,
    currentSku,
    nextProduct,
    nextSku,
    previousProduct,
    previousSku
  },
  transitioning,
  location
}) => {
  /**
   * @constant
   * @type React.MutableRefObject<HTMLDivElement>
   */
  const ref = useRef()
  /**
   * @constant
   * @type React.MutableRefObject<number>
   */
  const initialOffsetTop = useRef()
  const [{ x }, set] = useSpring(() => ({ x: 0 }))
  const isSwiping = useRef(false)

  const [topOffset, setTopOffset] = useState(0)

  useEffect(() => {
    initialOffsetTop.current = ref.current.getBoundingClientRect().top
  }, [transitioning])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          setTopOffset(
            initialOffsetTop.current - ref.current.getBoundingClientRect().top
          )
          ticking = false
        })

        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          config: {
            tension: 250,
            clamp: true
          },
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
    { threshold: THRESHOLD, swipeVelocity: 0.1 }
  )

  return (
    <animated.div
      {...bind()}
      ref={ref}
      style={{
        position: 'relative',
        left: x
      }}
    >
      {!transitioning && previousProduct && (
        <div
          className={styles.previousContainer}
          style={{
            top: topOffset
          }}
        >
          <ProductRaw product={previousProduct} sku={previousSku} />
        </div>
      )}
      <div className={styles.currentContainer}>
        <SEO
          title={currentProduct.name}
          description={currentProduct.description}
          image={
            currentProduct.images &&
            currentProduct.images.length &&
            currentProduct.images[0]
          }
          location={location}
        />
        <ProductRaw product={currentProduct} sku={currentSku} />
      </div>
      {!transitioning && nextProduct && (
        <div
          className={styles.nextContainer}
          style={{
            top: topOffset
          }}
        >
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
      <div className={styles.content}>
        <p>{product.description}</p>
        <p>
          <strong>Prix :</strong>
          <span className={styles.marginLeft}>
            {formatPrice(sku.price, sku.currency)}
          </span>
        </p>
        <p className={styles.buttons}>
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
        </p>
        <div className={styles.images}>
          {product.images.map((url, index) => (
            <div key={url}>
              <img
                src={url}
                alt={`Photo produit ${index}`}
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

export default SwipableProduct

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
