import React from 'react'
import { CartProvider } from './cart/cart'
import Layout from './layout/layout'
import { hot } from 'react-hot-loader/root'

const PageWrapper = ({ children, data }) => {
  return (
    <CartProvider>
      <Layout pageTitle={data.stripeProduct && data.stripeProduct.name}>
        {children}
      </Layout>
    </CartProvider>
  )
}

export const query = graphql`
  query($id: String) {
    stripeProduct(id: { eq: $id }) {
      name
    }
  }
`

export default hot(PageWrapper)
