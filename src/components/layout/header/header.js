import PropTypes from 'prop-types'
import React, { useState } from 'react'
import CartButton from '../../cart/cartButton'
import styles from './header.module.less'
import { MenuOutlined } from '@ant-design/icons'
import { Modal, Tag, Tooltip } from 'antd'
import SiteMenu from '../menu/menu'
import Logo from '../../logo'

const isTest = process.env.GATSBY_STRIPE_ENV === 'test'

const SiteHeader = ({ pageTitle, location }) => {
  const [isMenuOpen, setMenuOpen] = useState()
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <MenuOutlined onClick={() => setMenuOpen(true)} />
        <Modal
          visible={isMenuOpen}
          onCancel={() => setMenuOpen(false)}
          footer={null}
        >
          <Logo />
          <SiteMenu location={location} onSelect={() => setMenuOpen(false)} />
        </Modal>
      </div>

      <h1 className={styles.title}>
        {isTest && (
          <Tooltip
            title="Site de test ! Les produits et le paiement ne sont pas réels !"
            trigger={['hover', 'focus', 'click']}
          >
            <Tag color="warning">Test</Tag>
          </Tooltip>
        )}
        {pageTitle}
      </h1>
      <div className={styles.cart}>
        <CartButton />
      </div>
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
