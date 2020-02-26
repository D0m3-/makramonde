import PropTypes from 'prop-types'
import React from 'react'
import CartButton from '../../cart/cartButton'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import SwipeLink from '../../animation/swipe'
import Logo from '../../logo'
import styles from './header.module.less'

const SiteHeader = ({ pageTitle }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{pageTitle}</h1>
      <CartButton />
    </div>
  )
}

SiteHeader.propTypes = {
  siteTitle: PropTypes.string
}

SiteHeader.defaultProps = {
  siteTitle: ``
}

export default SiteHeader
