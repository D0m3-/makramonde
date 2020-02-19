import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { formatPrice } from "../util/price"
const Product = ({ data }) => {
  const product = data.stripeProduct
  const sku = data.stripeSku
  return (
    <Layout>
      <h1>{product.name}</h1>
      <p>{product.caption}</p>
      <p>{product.description}</p>
      <p>Price: {formatPrice(sku.price, sku.currency)}</p>
      {product.images.map(url => (
        <div>
          <img src={url} />
        </div>
      ))}
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
  }
`
