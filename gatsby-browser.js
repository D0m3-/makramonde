import React from "react"
import { CartProvider } from "./src/components/cart/cart"

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

export const wrapPageElement = ({ element, props }) => {
  return <CartProvider>{React.cloneElement(element, props)}</CartProvider>
}
