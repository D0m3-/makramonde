import React, { useState } from 'react'
import { Menu, Input } from 'antd'
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
import { getProducts } from '../../../util/product'

const { SubMenu } = Menu

const SiteMenu = props => (
  <StaticQuery
    query={graphql`
      query {
        allStripeProduct(
          filter: { active: { eq: true }, shippable: { eq: true } }
        ) {
          nodes {
            name
            description
            created
            metadata {
              category
            }
          }
        }

        allContentfulUniqueProduct {
          nodes {
            title
            description {
              json
            }
            createdAt
            categories {
              name
            }
          }
        }
      }
    `}
    render={data => <InnerMenu {...props} data={data} />}
  />
)

const InnerMenu = ({ data, location, onSelect }) => {
  const [search, setSearch] = useState('')
  const autres = []
  const categories = getProducts(data).reduce((categories, product) => {
    if (
      search.length &&
      !product.name.toLowerCase().includes(search.toLowerCase()) &&
      !(
        product.description &&
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return categories
    }
    if (!product.categories?.length) {
      autres[product.name] = getProductUrl(product)
      return categories
    }
    product.categories.forEach(category => {
      categories[category] = {
        ...categories[category],
        [product.name]: getProductUrl(product)
      }
    })
    return categories
  }, {})
  const onChange = e => {
    setSearch(e.target.value)
  }
  return (
    <div>
      <Input.Search
        className={styles.search}
        placeholder="Filtrer les créations"
        allowClear
        onChange={onChange}
      />
      <Menu
        defaultSelectedKeys={['1']}
        selectedKeys={[location.pathname]}
        mode="inline"
        className={styles.menu}
        onClick={onSelect}
        forceSubMenuRender
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
                    <SwipeLink direction="left" to={categories[category][name]}>
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
            <MessageOutlined />À propos
          </SwipeLink>
        </Menu.Item>
        <Menu.Item key="/legal">
          <SwipeLink direction="left" to={'/legal'}>
            <FileTextOutlined />
            Légal
          </SwipeLink>
        </Menu.Item>
      </Menu>
    </div>
  )
}

export default SiteMenu
