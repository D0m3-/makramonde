import React from 'react'

import SEO from '../components/seo'
import SwipeLink from '../components/animation/swipe'

const NotFoundPage = ({ location }) => (
  <>
    <SEO title="404: Introuvable" location={location} />
    <h1>Cette page n'existe pas</h1>
    <SwipeLink direction="left" to="/">
      Retourner à l'accueil
    </SwipeLink>
  </>
)

export default NotFoundPage
