import { PlusCircleOutlined, ShoppingOutlined } from '@ant-design/icons'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Button, Modal } from 'antd'
import { graphql, navigate } from 'gatsby'
import Img from 'gatsby-image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { SwipeSpring } from '../components/animation/swipe'
import { CartContext } from '../components/cart/cart'
import SEO from '../components/seo'
import { checkout } from '../stripe/checkout'
import { getProductUrl } from '../util/link'
import { formatPrice } from '../util/price'
import styles from './product.module.less'

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

const Product = ({ data: { site }, pageContext, transitioning, location }) => {
  const {
    current: currentProduct,
    next: nextProduct,
    previous: previousProduct
  } = pageContext
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
  const isSwipingFired = useRef(false)
  const [hasSwipeOffset, setHasSwipeOffset] = useState(false)

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
      setHasSwipeOffset(mx !== 0)
      if (isSwipingFired.current) {
        return
      }

      if (swipeX) {
        isSwipingFired.current = true
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

  const currentImage =
    currentProduct.localImages &&
    currentProduct.localImages.length &&
    currentProduct.localImages[0]

  return (
    <animated.div
      {...bind()}
      ref={ref}
      style={{
        position: 'relative',
        left: x
      }}
    >
      {previousProduct && hasSwipeOffset && (
        <aside
          className={styles.previousContainer}
          style={{
            top: topOffset
          }}
        >
          <ProductRaw product={previousProduct} />
        </aside>
      )}
      <main className={styles.currentContainer}>
        <SEO
          title={currentProduct.name}
          description={`${currentProduct.description} - Prix : ${formatPrice(
            currentProduct.price,
            currentProduct.currency
          )}`}
          image={
            currentImage &&
            `${site.siteMetadata.siteUrl}${currentImage.publicURL}`
          }
          location={location}
          jsonld={{
            '@type': 'Product',
            name: currentProduct.name,
            image:
              currentProduct.localImages &&
              currentProduct.localImages.map(
                ({ publicURL }) => `${site.siteMetadata.siteUrl}${publicURL}`
              ),
            description: currentProduct.description,
            sku: currentProduct.id,
            brand: {
              '@type': 'Brand',
              name: 'Makramonde'
            },
            manufacturer: {
              name: 'Makramonde'
            },
            offers: {
              '@type': 'Offer',
              url: `${site.siteMetadata.siteUrl}${location.pathname}`,
              priceCurrency: currentProduct.currency,
              price: currentProduct.price,
              itemCondition: 'https://schema.org/NewCondition',
              availability: 'https://schema.org/OnlineOnly',
              priceValidUntil: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              ).toISOString()
            }
          }}
        ></SEO>
        <ProductRaw product={currentProduct} />
      </main>
      {nextProduct && hasSwipeOffset && (
        <aside
          className={styles.nextContainer}
          style={{
            top: topOffset
          }}
        >
          <ProductRaw product={nextProduct} />
        </aside>
      )}
    </animated.div>
  )
}

const ProductRaw = ({ product }) => {
  const [image, setImage] = useState()
  const [loading, setLoading] = useState(false)

  const { addItem } = useContext(CartContext) || { addItem: () => {} }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {!product.richDescription && <p>{product.description}</p>}
        {product.richDescription &&
          documentToReactComponents(product.richDescription)}
        <p>
          <strong>Prix :</strong>
          <span className={styles.marginLeft}>
            {formatPrice(product.price, product.currency)}
          </span>
        </p>
        <p className={styles.buttons}>
          <Button
            type="default"
            icon={<PlusCircleOutlined />}
            onClick={() => addItem(product)}
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
              await checkout([product])
              setLoading(false)
            }}
          >
            acheter
          </Button>
        </p>
        <div className={styles.images}>
          {product.localImages &&
            product.localImages.map(
              ({ childImageSharp, id, publicURL }, index) => (
                <div
                  key={childImageSharp.id}
                  onClick={() => setImage({ childImageSharp, id, publicURL })}
                >
                  <Img
                    alt={`${product.name} - ${0}`}
                    fluid={childImageSharp.fluid}
                    className={styles.image}
                  />
                </div>
              )
            )}
        </div>
      </div>
      <Modal
        className={styles.modal}
        visible={!!image}
        onCancel={() => setImage(null)}
        footer={null}
        width="100%"
      >
        {image && (
          <img
            alt={`${product.name} - Plein écran`}
            src={image.publicURL}
            className={styles.imageModal}
          />
        )}
      </Modal>
    </div>
  )
}

export default SwipableProduct

export const query = graphql`
  query {
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
