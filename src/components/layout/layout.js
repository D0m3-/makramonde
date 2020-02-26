/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { Layout, Row, Col } from 'antd'

import './layout.less'
import styles from './layout.module.less'
import SiteHeader from './header/header'
import SiteSider from './sider/sider'

const { Header, Content, Footer, Sider } = Layout

const SiteLayout = ({ children }) => {
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
    sm: { span: 20, offset: 2 },
    md: { span: 14, offset: 5 },
    lg: { span: 12, offset: 6 },
    xl: { span: 10, offset: 7 },
    xxl: { span: 8, offset: 8 }
  }

  return (
    <Layout className={'full-height'}>
      <Sider>
        <SiteSider siteTitle={title} />
      </Sider>
      <Layout>
        <Header>
          <SiteHeader siteTitle={title} />
        </Header>
        <Content>
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
