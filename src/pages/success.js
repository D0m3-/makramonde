import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SuccessPage = () => (
  <Layout>
    <SEO title="Page two" />
    <h1>Merci pour votre achat!</h1>
    <p>Vous allez bientôt recevoir un email de confirmation.</p>
    <Link to="/">Retour au site</Link>
  </Layout>
)

export default SuccessPage
