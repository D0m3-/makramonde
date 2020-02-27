import React from 'react'
import AniLink from 'gatsby-plugin-transition-link/AniLink'

const SwipeLink = ({ children, ...props }) => (
  <AniLink swipe entryOffset={100} {...props}>
    {children}
  </AniLink>
)

export default SwipeLink
