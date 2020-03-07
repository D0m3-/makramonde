/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { Layout, Row, Col } from 'antd'

import './layout.less'
import styles from './layout.module.less'
import SiteHeader from './header/header'
import SiteSider from './sider/sider'

const { Header, Content, Footer, Sider } = Layout

const SiteLayout = ({ children, pageTitle, location }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const title = data.site.siteMetadata.title

  const DEFAULT_COL_PROPS = {
    xs: { span: 20, offset: 2 },
    sm: { span: 20, offset: 2 },
    md: { span: 16, offset: 4 },
    lg: { span: 14, offset: 5 },
    xl: { span: 12, offset: 6 },
    xxl: { span: 10, offset: 7 }
  }

  return (
    <Layout hasSider className={'full-height'}>
      <Sider
        theme="light"
        breakpoint="md"
        collapsedWidth="0"
        className={styles.sider}
        trigger={null}
      >
        <SiteSider siteTitle={title} location={location} />
      </Sider>
      <Layout>
        <Header theme="light">
          <SiteHeader pageTitle={pageTitle} location={location} />
        </Header>
        <Content className={styles.content}>
          <Row className={'full-height'}>
            <Col {...DEFAULT_COL_PROPS}>{children}</Col>
          </Row>
        </Content>
        <Footer>
          <span className={styles.footer}>
            © Oriane Bernard {new Date().getFullYear()}. Tous droits réservés.
          </span>
        </Footer>
      </Layout>
    </Layout>
  )
}

SiteLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default SiteLayout
