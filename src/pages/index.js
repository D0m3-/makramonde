import { Button } from 'antd'
import { graphql } from 'gatsby'
import React, { useMemo } from 'react'
import {
  FRANCE_METRO,
  SHIPPING,
} from '../../functions/createCheckout/constants/shipping'
import SwipeLink, { SwipeSpring } from '../components/animation/swipe'
import AssemblageImage from '../components/imageAssemblage'
import MakramondeBijouImage from '../components/imageMakramondeBijou'
import SEO from '../components/seo'
import { getProductUrl } from '../util/link'
import { getProducts } from '../util/product'
import styles from './index.module.less'

const IndexPage = ({ data, location }) => {
  const products = getProducts(data)
  const firstProduct = products.length && products[0]

  const content = useMemo(
    () => (
      <>
        <h2>
          <MakramondeBijouImage />
        </h2>
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
            <div className={styles.explore}>
              <Button type="primary" size="large">
                <SwipeLink direction="left" to={getProductUrl(firstProduct)}>
                  Explorer
                </SwipeLink>
              </Button>
            </div>
          </>
        )}
        {!firstProduct && (
          <p>
            Je n'ai actuellement aucune création à vous proposer en ligne.
            Revenez bientôt pour voir mes nouveautés !
          </p>
        )}
        <h2>
          <AssemblageImage />
        </h2>
      </>
    ),
    [firstProduct]
  )
  const swipe = useMemo(() => <SwipeSpring>{() => content}</SwipeSpring>, [
    content,
  ])
  return (
    <>
      <SEO
        lang="fr"
        location={location}
        jsonld={{
          '@type': 'WebSite',
          url: data.site.siteMetadata.siteUrl,
          inLanguage: 'fr',
          keywords:
            'macramé, ecommerce, bijou, unique, métal, art, pierres, création, atelier, makramonde',
          description: data.site.siteMetadata.description,
          image: `${data.site.siteMetadata.siteUrl}${data.defaultImage.childImageSharp.resize.src}`,
          name: data.site.siteMetadata.title,
          alternateName: `Makramonde | Ecommerce macramé`,
        }}
      />
      {swipe}
    </>
  )
}

export default IndexPage

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
      }
    }
    allStripeProduct(
      limit: 1
      filter: { active: { eq: true }, shippable: { eq: true } }
      sort: { order: DESC, fields: updated }
    ) {
      nodes {
        id
        name
        created
        updated
      }
    }
    allContentfulUniqueProduct(
      limit: 1
      sort: { order: DESC, fields: updatedAt }
    ) {
      nodes {
        contentful_id
        title
        createdAt
        updatedAt
      }
    }
    defaultImage: file(relativePath: { eq: "makramonde-bijou.png" }) {
      childImageSharp {
        resize(width: 600, height: 350, cropFocus: NORTH) {
          src
        }
      }
    }
  }
`
