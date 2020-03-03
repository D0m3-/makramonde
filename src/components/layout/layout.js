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

  const [collapseSider, setCollapseSider] = useState(false)
  const [brokenSider, setBrokenSider] = useState(false)

  return (
    <Layout className={'full-height ant-layout-has-sider'}>
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        className={styles.sider}
        collapsed={brokenSider && collapseSider}
        onBreakpoint={broken => {
          setBrokenSider(broken)
          setCollapseSider(broken)
        }}
        onCollapse={(collapse, type) => setCollapseSider(collapse)}
      >
        <SiteSider
          siteTitle={title}
          location={location}
          collapse={() => setCollapseSider(true)}
        />
      </Sider>
      <Layout>
        <Header>
          <SiteHeader pageTitle={pageTitle} />
        </Header>
        <Content className={styles.content}>
          <Row className={'full-height'}>
            <Col {...DEFAULT_COL_PROPS}>{children}</Col>
          </Row>
        </Content>
        <Footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </Footer>
      </Layout>
    </Layout>
  )
}

SiteLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default SiteLayout
