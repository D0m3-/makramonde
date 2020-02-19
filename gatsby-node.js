/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const slug = require("slug")

  const { createPage } = actions

  const result = await graphql(`
    query {
      allStripeProduct(
        filter: { active: { eq: true }, shippable: { eq: true } }
      ) {
        edges {
          node {
            id
            name
            created
          }
        }
      }
    }
  `)

  result.data.allStripeProduct.edges.forEach(({ node }) =>
    createPage({
      path: `/products/${slug(node.name)}-${node.created}`,
      component: path.resolve(`./src/templates/product.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        id: node.id,
      },
    })
  )
}
