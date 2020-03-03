import React from 'react'

import styles from './sider.module.less'
import Logo from '../../logo'
import SwipeLink from '../../animation/swipe'
import {
  TagsOutlined,
  HomeOutlined,
  MessageOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { Menu } from 'antd'
import { StaticQuery } from 'gatsby'
import { getProductUrl } from '../../../util/link'

const { SubMenu } = Menu

const SiteSider = ({ siteTitle, location, collapse }) => {
  return (
    <StaticQuery
      query={graphql`
        query {
          allStripeProduct(
            filter: { active: { eq: true }, shippable: { eq: true } }
          ) {
            edges {
              node {
                name
                created
                metadata {
                  category
                }
              }
            }
          }
        }
      `}
      render={data => {
        const autres = []
        const categories = data.allStripeProduct.edges.reduce(
          (categories, { node }) => {
            const category = node.metadata && node.metadata.category
            if (!category) {
              autres[node.name] = getProductUrl(node)
              return categories
            }
            return {
              ...categories,
              [category]: {
                ...categories[category],
                [node.name]: getProductUrl(node)
              }
            }
          },
          {}
        )
        return (
          <>
            <div className={styles.container}>
              <div className={styles.logo}>
                <Logo />
              </div>
              <h1 className={styles.title}>
                <SwipeLink
                  direction="right"
                  to="/"
                  style={{
                    color: `white`,
                    textDecoration: `none`
                  }}
                >
                  {siteTitle}
                </SwipeLink>
              </h1>
            </div>
            <Menu
              theme="dark"
              defaultSelectedKeys={['1']}
              selectedKeys={[location.pathname]}
              mode="inline"
              className={styles.menu}
              onClick={collapse}
            >
              <Menu.Item key="/">
                <SwipeLink direction="right" to={'/'}>
                  <HomeOutlined />
                  Accueil
                </SwipeLink>
              </Menu.Item>
              {Object.keys(categories)
                .sort()
                .map(category => (
                  <SubMenu
                    key={category}
                    title={
                      <span>
                        <TagsOutlined />
                        <span>{category}</span>
                      </span>
                    }
                  >
                    {Object.keys(categories[category])
                      .sort()
                      .map(name => (
                        <Menu.Item key={categories[category][name]}>
                          <SwipeLink
                            direction="left"
                            to={categories[category][name]}
                          >
                            {name}
                          </SwipeLink>
                        </Menu.Item>
                      ))}
                  </SubMenu>
                ))}
              {!!Object.keys(autres).length && (
                <SubMenu
                  key={'autres'}
                  title={
                    <span>
                      <TagsOutlined />
                      <span>autres</span>
                    </span>
                  }
                >
                  {Object.keys(autres)
                    .sort()
                    .map(name => (
                      <Menu.Item key={autres[name]}>
                        <SwipeLink direction="left" to={autres[name]}>
                          {name}
                        </SwipeLink>
                      </Menu.Item>
                    ))}
                </SubMenu>
              )}
              <Menu.Item key="2">
                <MessageOutlined />
                <span>Contact</span>
              </Menu.Item>
              <Menu.Item key="/legal">
                <SwipeLink direction="left" to={'/legal'}>
                  <FileTextOutlined />
                  Légal
                </SwipeLink>
              </Menu.Item>
            </Menu>
          </>
        )
      }}
    />
  )
}

export default SiteSider
