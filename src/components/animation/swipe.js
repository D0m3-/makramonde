import React from 'react'
import { Link } from 'gatsby'

const SwipeLink = ({ children, ...props }) => <Link {...props}>{children}</Link>

export default SwipeLink
