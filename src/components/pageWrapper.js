import React from 'react'
import { CartProvider } from './cart/cart'
import Layout from './layout/layout'
import { hot } from 'react-hot-loader/root'

const PageWrapper = ({ children }) => {
  return (
    <Layout>
      <CartProvider>{children}</CartProvider>
    </Layout>
  )
}

export default hot(PageWrapper)
