import React from 'react'
import { Link } from 'gatsby'

import SEO from '../components/seo'

const SuccessPage = ({ location }) => (
  <>
    <SEO title="Achat finalisé" location={location} />
    <h1>Merci pour votre achat!</h1>
    <p>Vous allez bientôt recevoir un email de confirmation.</p>
    <Link to="/">Retour au site</Link>
  </>
)

export default SuccessPage
