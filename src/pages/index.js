import React, { useState, useMemo } from 'react'

import SEO from '../components/seo'
import { getProductUrl } from '../util/link'
import SwipeLink, { SwipeSpring } from '../components/animation/swipe'
import {
  SHIPPING,
  FRANCE_METRO
} from '../../functions/createCheckout/constants/shipping'
import AtelierDarkImage from '../components/imageAtelierDark'
import MakramondeBijouImage from '../components/imageMakramondeBijou'
import AssemblageImage from '../components/imageAssemblage'
import { Button } from 'antd'
import styles from './index.module.less'

const IndexPage = ({ data, location }) => {
  const firstProduct =
    data.allStripeProduct.edges.length && data.allStripeProduct.edges[0].node

  const content = useMemo(
    () => (
      <>
        <p>
          <MakramondeBijouImage />
        </p>
        <h1>
          Des bijoux artisanaux aux influences ethniques et antiques d'autour du
          monde
        </h1>
        <p>
          Tous les bijoux sont fabriqués entièrement à la main dans mon atelier
          en Haute-Savoie, à Annecy. <br />
          Les matériaux utilisés sont de qualités ; argent 925 poinçonné de mon
          poinçon de maître, laiton et cuivre pour les autres métaux (exempts de
          nickel), fil ciré résistant à l'eau pour le macramé.
        </p>
        <p>
          Livraison à 1 centime à partir de{' '}
          {SHIPPING[FRANCE_METRO].discountFrom / 100}€, en France Metropolitaine
          uniquement.
        </p>
        {!!firstProduct && (
          <>
            <p>Pour voir mes dernières créations, c'est par ici :</p>
            <p key={'explore'} className={styles.explore}>
              <SwipeLink direction="left" to={getProductUrl(firstProduct)}>
                <Button type="primary" size="large">
                  Explorer
                </Button>
              </SwipeLink>
            </p>
          </>
        )}
        {!firstProduct && (
          <p>
            Je n'ai actuellement aucune création à vous proposer en ligne.
            Revenez bientôt pour voir mes nouveautés !
          </p>
        )}
        <p>
          <AssemblageImage />
        </p>
      </>
    ),
    [firstProduct]
  )
  const swipe = useMemo(() => <SwipeSpring>{() => content}</SwipeSpring>, [
    firstProduct
  ])
  return (
    <>
      <SEO lang="fr" location={location} />
      {swipe}
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
