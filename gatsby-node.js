/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')
const { getProductUrl } = require('./src/util/link')

exports.sourceNodes = ({ actions, getNodes }) => {
  const hasProduct = getNodes().filter(
    node => node.object && node.object === 'product'
  ).length
  if (!hasProduct) {
    console.log('No Product found, need to define types manually')
    actions.createTypes(
      `type StripeProduct implements Node { 
      id: ID!, 
      active: Boolean, 
      shippable: Boolean, 
      name: String, 
      created: Int, 
      metadata:Metadata, 
      images: [String], 
      description: String 
    }
    type Metadata implements Node {
      category: String
    }
    type StripeSku implements Node {
      id: ID!,
      currency: String,
      price: Int,
      attributes: Attributes,
      product: StripeProduct
    }
    type Attributes implements Node{
      name: String
    }
    `
    )
  }
}

exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info

  const { createPage } = actions

  // Product pages
  const productsQuery = await graphql(`
    query {
      allStripeProduct(
        filter: { active: { eq: true }, shippable: { eq: true } }
      ) {
        edges {
          node {
            id
            name
            created
            metadata {
              category
            }
          }
        }
      }
    }
  `)

  productsQuery.data &&
    productsQuery.data.allStripeProduct.edges.forEach(({ node }) =>
      createPage({
        path: getProductUrl(node),
        component: path.resolve(`./src/templates/product.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          id: node.id,
          title: node.name,
        }
      })
    )

  // Markdown pages
  const markdownTemplate = path.resolve(`src/templates/markdownTemplate.js`)
  const markdownQuery = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
              title
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (markdownQuery.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  markdownQuery.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: markdownTemplate,
      context: {
        title: node.frontmatter.title
      } // additional data can be passed via context
    })
  })
}
