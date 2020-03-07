import React from 'react'

import styles from './sider.module.less'
import Logo from '../../logo'
import SwipeLink from '../../animation/swipe'

import { Menu } from 'antd'
import SiteMenu from '../menu/menu'

const SiteSider = ({ siteTitle, location }) => {
  return (
    <>
      <div className={styles.container}>
        <SwipeLink direction="right" to="/">
          <Logo />
        </SwipeLink>
      </div>
      <SiteMenu location={location} />
    </>
  )
}

export default SiteSider
