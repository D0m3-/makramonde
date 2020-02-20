import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Skus from "../components/products/skus"
import CartButton from "../components/cart/cartButton"
import { getProductUrl } from "../util/link"

const IndexPage = ({ data }) => {
  const firstProduct = data.allStripeProduct.edges[0].node
  return (
    <Layout>
      <SEO title="Accueil" lang="fr" description="Bijoux uniques en macramé" />
      <h1>Bonjour</h1>
      <p>Bienvenue dans ma boutique</p>
      <Link to={getProductUrl(firstProduct)}>
        Par ici pour voir mes créations !
      </Link>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allStripeProduct(
      limit: 1
      filter: { active: { eq: true }, shippable: { eq: true } }
    ) {
      edges {
        node {
          id
          name
          created
        }
      }
    }
  }
`
