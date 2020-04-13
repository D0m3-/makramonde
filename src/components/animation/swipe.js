import React, { useRef } from 'react'
import { animated } from 'react-spring'
import { Spring } from 'react-spring/renderprops'
import TransitionLink, { TransitionState } from 'gatsby-plugin-transition-link'

const SwipeLink = ({ children, direction, ...props }) => (
  <TransitionLink
    exit={{ state: direction, length: 1 }}
    entry={{ state: direction, length: 1 }}
    {...props}
  >
    {children}
  </TransitionLink>
)

export const SwipeSpring = ({ children }) => {
  return (
    <TransitionState>
      {context => {
        if (!context) {
          return children
        }
        const springProps = getSpringProps(context)
        console.log(context)
        if (!springProps) {
          return children
        }
        return (
          <Spring
            {...springProps}
            config={{
              duration: 1000
            }}
          >
            {props => (
              <animated.div style={{ position: 'relative', ...props }}>
                {children}
              </animated.div>
            )}
          </Spring>
        )
      }}
    </TransitionState>
  )
}

const getSpringProps = ({ transitionStatus, current }) => {
  if (current.state === 'left') {
    switch (transitionStatus) {
      case 'exiting':
        return {
          from: {
            left: '0%'
          },
          to: {
            left: '-100%'
          }
        }
      case 'entering':
        return {
          from: {
            left: '100%'
          },
          to: {
            left: '0%'
          }
        }
    }
  }
  switch (transitionStatus) {
    case 'exiting':
      return {
        from: {
          left: '0%'
        },
        to: {
          left: '100%'
        }
      }
    case 'entering':
      return {
        from: {
          left: '-100%'
        },
        to: {
          left: '0%'
        }
      }
  }
}

export default SwipeLink
