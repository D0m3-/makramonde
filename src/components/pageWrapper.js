import React from 'react'
import { CartProvider } from './cart/cart'
import Layout from './layout/layout'
import { hot } from 'react-hot-loader/root'

const PageWrapper = ({ children }) => {
  return (
    <CartProvider>
      <Layout>{children}</Layout>
    </CartProvider>
  )
}

export default hot(PageWrapper)
