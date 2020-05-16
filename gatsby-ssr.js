/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// Hack, to reorder the helmet components as first in <head> tag
exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  /**
   * @type {any[]} headComponents
   */
  const headComponents = getHeadComponents()
  headComponents.sort((a, b) => {
    const aIsDataHelmet = isDataHelmet(a)
    const bIsDataHelmet = isDataHelmet(b)
    if (aIsDataHelmet && bIsDataHelmet) {
      return 0
    }
    if (aIsDataHelmet) {
      return -1
    }
    if (bIsDataHelmet) {
      return 1
    }
    return 0
  })
  replaceHeadComponents(headComponents)
}

const isDataHelmet = x => x.props && x.props['data-react-helmet']
