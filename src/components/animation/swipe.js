import React, { useRef, useCallback, useMemo } from 'react'
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
          return children({ transitioning: false })
        }
        const springProps = getSpringProps(context)
        if (!springProps) {
          return children({ transitioning: false })
        }
        return (
          <Spring
            {...springProps}
            config={{
              duration: 1000,
              easing: easeInOutCubic
            }}
          >
            {props => (
              <AnimatedContainer animatedProps={props}>
                {children}
              </AnimatedContainer>
            )}
          </Spring>
        )
      }}
    </TransitionState>
  )
}

const AnimatedContainer = ({ animatedProps, children }) => {
  const memoChildren = useMemo(
    () => children({ transitioning: true }),
    children
  )
  return (
    <animated.div style={{ position: 'relative', ...animatedProps }}>
      {memoChildren}
    </animated.div>
  )
}

const getSpringProps = ({ transitionStatus, current }) => {
  if (!current.length) {
    return
  }
  if (current.state === 'left') {
    switch (transitionStatus) {
      case 'exiting':
        return {
          from: {
            left: '0%'
          },
          to: {
            left: '-105%'
          }
        }
      case 'entering':
        return {
          from: {
            left: '105%'
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
          left: '105%'
        }
      }
    case 'entering':
      return {
        from: {
          left: '-105%'
        },
        to: {
          left: '0%'
        }
      }
  }
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export default SwipeLink
