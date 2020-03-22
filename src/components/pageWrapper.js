import React from 'react'
import { CartProvider } from './cart/cart'
import Layout from './layout/layout'
import { hot } from 'react-hot-loader/root'

const PageWrapper = ({ children, pageContext, location }) => {
  return (
    <CartProvider>
      <Layout
        pageTitle={pageContext.title || getPageTitle(location.pathname)}
        location={location}
        productId={pageContext.id}
      >
        {children}
      </Layout>
    </CartProvider>
  )
}

const getPageTitle = pathname => {
  switch (pathname.replace(/\/$/, ``)) {
    case '/success':
      return 'Commandé !'
    case '':
      return 'Accueil'
    default:
      return 'Oups !'
  }
}

export default hot(PageWrapper)
