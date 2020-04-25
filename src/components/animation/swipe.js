import React, { useRef, useCallback, useMemo, useState } from 'react'
import { animated, useSpring, useChain } from 'react-spring'
import TransitionLink, { TransitionState } from 'gatsby-plugin-transition-link'
import { Link } from 'gatsby'

const SwipeLink = ({ children, direction, ...props }) => {
  const [triggered, setTriggered] = useState(false)
  const [ready, setReady] = useState(false)
  if (!ready) {
    return (
      <>
        <Link
          onClick={e => {
            setTriggered(true)
            e.preventDefault()
          }}
        >
          {children}
        </Link>
        {triggered && <Scroller onDone={() => setReady(true)}></Scroller>}
      </>
    )
  }
  return (
    <TransitionLink
      ref={ref => ref && ref.click()}
      exit={{ state: direction, length: 1, delay: 0.25 }}
      entry={{ state: direction, length: 1, delay: 0.25 }}
      {...props}
    >
      {children}
    </TransitionLink>
  )
}

const Scroller = ({ onDone }) => {
  useSpring({
    y: 0,
    reset: true,
    from: { y: window.scrollY },
    config: {
      tension: 200,
      clamp: true
    },
    onFrame: props => window.scroll(0, props.y),
    onRest: onDone
  })
  return null
}

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
        return <Animator springProps={springProps}>{children}</Animator>
      }}
    </TransitionState>
  )
}

const Animator = ({ springProps, children }) => {
  const props = useSpring({
    ...springProps,
    config: {
      duration: 1000,
      easing: easeInOutCubic
    }
  })
  return <AnimatedContainer animatedProps={props}>{children}</AnimatedContainer>
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
