import React, { useState } from 'react'

import SEO from '../components/seo'
import { getProductUrl } from '../util/link'
import SwipeLink from '../components/animation/swipe'
import {
  SHIPPING,
  FRANCE_METRO
} from '../../functions/createCheckout/constants/shipping'
import StandImage from '../components/imageStand'
import AtelierDarkImage from '../components/imageAtelierDark'

const IndexPage = ({ data }) => {
  const firstProduct = data.allStripeProduct.edges[0].node
  return (
    <>
      <SEO title="Accueil" lang="fr" description="Bijoux uniques en macramé" />
      <h1>Bienvenue dans ma boutique de bijoux uniques en macramé</h1>
      <p>
        <StandImage />
      </p>
      <p>
        Tous les bijoux sont fabriqués à la main dans mon atelier en Ardèche.
      </p>
      <p>
        Les matériaux utilisés sont de qualité ; argent 925 (poinçonné), laiton
        et cuivre pour les métaux (pas de nickel), fil ciré résistant à l'eau
        pour le macramé.
      </p>
      <p>
        Livraison à 1 centime à partir de{' '}
        {SHIPPING[FRANCE_METRO].discountFrom / 100}€, en France Metropolitaine
        uniquement.
      </p>
      <p>
        <SwipeLink direction="left" to={getProductUrl(firstProduct)}>
          Cliquez ici pour voir mes dernières créations !
        </SwipeLink>
      </p>
      <p>
        <AtelierDarkImage />
      </p>
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
