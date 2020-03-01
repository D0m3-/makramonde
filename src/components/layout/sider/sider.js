import React from 'react'

import styles from './sider.module.less'
import Logo from '../../logo'
import SwipeLink from '../../animation/swipe'
import { Menu, Icon } from 'antd'
import { StaticQuery } from 'gatsby'

const { SubMenu } = Menu

const SiteSider = ({ siteTitle }) => {
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
              autres.push(node.name)
              return categories
            }
            return {
              ...categories,
              [category]: [...(categories[category] || []), node.name]
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
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" className={styles.capitalize}>
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Accueil</span>
              </Menu.Item>
              {Object.keys(categories)
                .sort()
                .map(category => (
                  <SubMenu
                    key={category}
                    title={
                      <span>
                        <Icon type="user" />
                        <span>{category}</span>
                      </span>
                    }
                  >
                    {categories[category].sort().map(name => (
                      <Menu.Item key={name}>{name}</Menu.Item>
                    ))}
                  </SubMenu>
                ))}
              {!!autres.length && (
                <SubMenu
                  key={'autres'}
                  title={
                    <span>
                      <Icon type="user" />
                      <span>autres</span>
                    </span>
                  }
                >
                  {autres.sort().map(name => (
                    <Menu.Item key={name}>{name}</Menu.Item>
                  ))}
                </SubMenu>
              )}
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Contact</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="desktop" />
                <span>Legal</span>
              </Menu.Item>
            </Menu>
          </>
        )
      }}
    />
  )
}

export default SiteSider
