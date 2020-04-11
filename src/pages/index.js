import React, { useState } from 'react'

import SEO from '../components/seo'
import { getProductUrl } from '../util/link'
import SwipeLink from '../components/animation/swipe'
import {
  SHIPPING,
  FRANCE_METRO
} from '../../functions/createCheckout/constants/shipping'
import AtelierDarkImage from '../components/imageAtelierDark'
import MakramondeBijouImage from '../components/imageMakramondeBijou'

const IndexPage = ({ data }) => {
  const firstProduct =
    data.allStripeProduct.edges.length && data.allStripeProduct.edges[0].node
  return (
    <>
      <SEO title="Accueil" lang="fr" description="Bijoux uniques en macramé" />
      <p>
        <MakramondeBijouImage />
      </p>
      <p>Des bijoux artisanaux aux influences ethniques et antiques d'autour du monde </p>
      <p>
      Tous les bijoux sont fabriqués entièrement à la main dans mon atelier en Haute-Savoie, à Annecy. <br/>
Les matériaux utilisés sont de qualités ; argent 925 poinçonné de mon poinçon de maître, laiton et cuivre pour les autres métaux (exempts de nickel), fil ciré résistant à l'eau pour le macramé.
      </p>
      <p>
        Livraison à 1 centime à partir de{' '}
        {SHIPPING[FRANCE_METRO].discountFrom / 100}€, en France Metropolitaine
        uniquement.
      </p>
      {!!firstProduct && (
        <p>
          <SwipeLink direction="left" to={getProductUrl(firstProduct)}>
            Cliquez ici pour voir mes dernières créations !
          </SwipeLink>
        </p>
      )}
      {!firstProduct && (
        <p>
          Je n'ai actuellement aucune création à vous proposer en ligne. Revenez
          bientôt pour voir mes nouveautés !
        </p>
      )}
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
