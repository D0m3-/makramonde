import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Skus from "../components/products/skus"
import CartButton from "../components/cart/cartButton"

const IndexPage = () => {
  const [cartItems, setCartItems] = useState(new Set())
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Bonjour</h1>
      <p>Welcome to my shop!</p>
      <p>Have a look at my awesome craft.</p>
      <Skus onAddToCart={item => setCartItems(new Set([...cartItems, item]))} />
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <CartButton items={[...cartItems]} />
      <Link to="/page-2/">Go to page 2</Link>
    </Layout>
  )
}

export default IndexPage
