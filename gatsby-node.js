/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')
const { getProductUrl } = require('./src/util/link')
const { getProducts } = require('./src/util/product')

exports.sourceNodes = ({ actions, getNodes }) => {
  const hasProduct = getNodes().filter(
    (node) => node.object && node.object === 'product'
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

  const GatsbyImageSharpFluid_withWebp_tracedSVG = `
    fragment GatsbyImageSharpFluid_withWebp_tracedSVG on ImageSharpFluid {
      tracedSVG
      aspectRatio
      src
      srcSet
      srcWebp
      srcSetWebp
      sizes
    }
  `

  // Product pages
  const productsQuery = await graphql(`
    ${GatsbyImageSharpFluid_withWebp_tracedSVG}
    query {
      allStripeProduct(
        filter: { active: { eq: true }, shippable: { eq: true } }
      ) {
        nodes {
          id
          name
          description
          created
          updated
          metadata {
            category
          }
          localImages {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
            publicURL
          }
        }
      }
      allStripeSku {
        nodes {
          id
          price
          currency
          product {
            id
          }
        }
      }
      allContentfulUniqueProduct {
        nodes {
          contentful_id
          title
          createdAt
          updatedAt
          price
          categories {
            name
          }
          description {
            raw
          }
          images {
            localFile {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
              publicURL
            }
          }
        }
      }
    }
  `)

  if (productsQuery.data) {
    const products = getProducts(productsQuery.data)
    products.forEach((node, index) =>
      createPage({
        path: getProductUrl(node),
        component: path.resolve(`./src/templates/product.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          current: node,
          previous: index > 0 ? products[index - 1] : undefined,
          next: index < products.length - 1 ? products[index + 1] : undefined,
        },
      })
    )
  }

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
        title: node.frontmatter.title,
      }, // additional data can be passed via context
    })
  })
}
