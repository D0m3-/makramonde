import React, { useContext } from "react"
import { graphql } from "gatsby"

import { formatPrice } from "../util/price"
import { CartContext } from "../components/cart/cart"
import { checkout } from "../stripe/checkout"
import { getProductUrl } from "../util/link"
import Layout from "../components/layout"
import SwipeLink from "../components/animation/swipe"

const Product = ({ data }) => {
  const product = data.stripeProduct
  const sku = data.stripeSku
  const { next, previous } = data.allStripeProduct.edges.find(
    edge => edge.node.id == product.id
  )
  const { addItem } = useContext(CartContext) || { addItem: () => {} }
  return (
    <Layout>
      <h1>{product.name}</h1>
      <p>{product.caption}</p>
      <p>{product.description}</p>
      <p>Price: {formatPrice(sku.price, sku.currency)}</p>
      {product.images.map(url => (
        <div key={url}>
          <img src={url} />
        </div>
      ))}
      <button onClick={() => addItem(sku)}>Ajouter au panier</button>
      <button onClick={() => checkout([sku])}>Acheter immediatement</button>
      <br></br>
      {previous && (
        <SwipeLink direction="right" to={getProductUrl(previous)}>
          {"<"}
        </SwipeLink>
      )}
      {next && (
        <SwipeLink direction="left" to={getProductUrl(next)}>
          {">"}
        </SwipeLink>
      )}
    </Layout>
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
