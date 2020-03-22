import React, { useContext, useState } from 'react'
import { graphql, Link, StaticQuery } from 'gatsby'
import { RightCircleFilled, LeftCircleFilled } from '@ant-design/icons'

import { getProductUrl } from '../../util/link'
import SwipeLink from '../animation/swipe'
import { Button } from 'antd'
import styles from './arrows.module.less'

const Arrow = ({ node, direction }) => (
  <SwipeLink
    className={styles.arrowContainer}
    direction={direction === 'right' ? 'left' : 'right'}
    to={node && getProductUrl(node)}
  >
    <Button
      type="link"
      icon={
        direction === 'right' ? <RightCircleFilled /> : <LeftCircleFilled />
      }
      disabled={!node}
      block
      className={styles.arrow}
    ></Button>
  </SwipeLink>
)

const Arrows = ({productId}) => {
  return (
    <StaticQuery
      query={graphql`
        query {
          allStripeProduct(
            filter: { active: { eq: true }, shippable: { eq: true } }
          ) {
            edges {
              next {
                name
                created
              }
              previous {
                name
                created
              }
              node {
                id
              }
            }
          }
        }
      `}
      render={(data) => {
        const { next, previous } = data.allStripeProduct.edges.find(
          edge => edge.node.id == productId
        ) || {}
        return (
          <>
            <div className={styles.arrowLeft}>
              <div className={styles.arrowFloater}>
                <Arrow node={previous} direction="left" />
              </div>
            </div>
            <div className={styles.arrowRight}>
              <div className={styles.arrowFloater}>
                <Arrow node={next} direction="right" />
              </div>
            </div>
          </>
        )
      }}
    ></StaticQuery>
  )
}

export default Arrows
