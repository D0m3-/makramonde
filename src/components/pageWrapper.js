import React from "react"
import { CartProvider } from "./cart/cart"
import Layout from "./layout"

const PageWrapper = ({ children }) => {
  return <CartProvider>{children}</CartProvider>
}

export default PageWrapper
