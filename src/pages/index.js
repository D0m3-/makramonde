import React, { useState } from 'react'

import Image from '../components/image'
import SEO from '../components/seo'
import { getProductUrl } from '../util/link'
import SwipeLink from '../components/animation/swipe'
import {
  SHIPPING,
  FRANCE_METRO
} from '../../functions/createCheckout/constants/shipping'

const IndexPage = ({ data }) => {
  const firstProduct = data.allStripeProduct.edges[0].node
  return (
    <>
      <SEO title="Accueil" lang="fr" description="Bijoux uniques en macramé" />
      <h1>Bonjour</h1>
      <p>Bienvenue dans ma boutique</p>
      <p>
        Livraison à 1 centime à partir de{' '}
        {SHIPPING[FRANCE_METRO].discountFrom / 100}€, en France Metropolitaine
        uniquement.
      </p>
      <SwipeLink direction="left" to={getProductUrl(firstProduct)}>
        Par ici pour voir mes créations !
      </SwipeLink>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </>
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
