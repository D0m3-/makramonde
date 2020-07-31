import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import { RightCircleFilled, LeftCircleFilled } from '@ant-design/icons'

import { getProductUrl } from '../../util/link'
import SwipeLink from '../animation/swipe'
import { Button } from 'antd'
import styles from './arrows.module.less'

const Arrow = ({ name, created, direction }) => (
  <SwipeLink
    className={styles.arrowContainer}
    direction={direction === 'right' ? 'left' : 'right'}
    to={name && getProductUrl({ name, created })}
  >
    <Button
      type="link"
      icon={
        direction === 'right' ? <RightCircleFilled /> : <LeftCircleFilled />
      }
      disabled={!name}
      block
      className={styles.arrow}
    ></Button>
  </SwipeLink>
)

const Arrows = ({ previousProduct, nextProduct }) => {
  return (
    <>
      <div className={styles.arrowLeft}>
        <div className={styles.arrowFloater}>
          <Arrow {...previousProduct} direction="left" />
        </div>
      </div>
      <div className={styles.arrowRight}>
        <div className={styles.arrowFloater}>
          <Arrow {...nextProduct} direction="right" />
        </div>
      </div>
    </>
  )
}

export default Arrows
