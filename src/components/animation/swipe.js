import React from "react"
import AniLink from "gatsby-plugin-transition-link/AniLink"

const SwipeLink = ({ children, ...props }) => (
  <AniLink swipe entryOffset={80} {...props}>
    {children}
  </AniLink>
)

export default SwipeLink
