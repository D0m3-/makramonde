import PropTypes from "prop-types"
import React from "react"
import CartButton from "./cart/cartButton"
import AniLink from "gatsby-plugin-transition-link/AniLink"
import SwipeLink from "./animation/swipe"

const Header = ({ siteTitle }) => {
  return (
    <header
      style={{
        background: `rebeccapurple`,
        marginBottom: `1.45rem`,
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
        }}
      >
        <h1 style={{ margin: 0 }}>
          <SwipeLink
            direction="right"
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </SwipeLink>
        </h1>
        <CartButton />
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
