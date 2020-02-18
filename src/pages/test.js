import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Skus from "../components/products/skus"
import CartButton from "../components/cart/cartButton"

const TestPage = () => {
  const [cartItems, setCartItems] = useState(new Set())
  return (
    <Layout>
      <SEO title="Test" />
      <h1>Test page</h1>
      <Skus onAddToCart={item => setCartItems(new Set([...cartItems, item]))} />
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <CartButton items={[...cartItems]} onClear={() => setCartItems([])} />
    </Layout>
  )
}

export default TestPage
