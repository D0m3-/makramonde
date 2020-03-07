import React from 'react'
import { Menu } from 'antd'
import SwipeLink from '../../animation/swipe'
import {
  TagsOutlined,
  HomeOutlined,
  MessageOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { StaticQuery } from 'gatsby'
import { getProductUrl } from '../../../util/link'
import styles from './menu.module.less'

const { SubMenu } = Menu

const SiteMenu = ({ location, onSelect }) => (
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
        <Menu
          defaultSelectedKeys={['1']}
          selectedKeys={[location.pathname]}
          mode="inline"
          className={styles.menu}
          onClick={onSelect}
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
          <Menu.Item key="/contact">
            <SwipeLink direction="left" to={'/contact'}>
              <MessageOutlined />
              Contact
            </SwipeLink>
          </Menu.Item>
          <Menu.Item key="/legal">
            <SwipeLink direction="left" to={'/legal'}>
              <FileTextOutlined />
              Légal
            </SwipeLink>
          </Menu.Item>
        </Menu>
      )
    }}
  />
)

export default SiteMenu
