require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const fs = require('fs')
const lessToJs = require('less-vars-to-js')

const plugins = [
  `gatsby-plugin-react-helmet`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `markdown-pages`,
      path: `${__dirname}/src/markdown-pages`
    }
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/src/images`
    }
  },
  {
    resolve: `gatsby-plugin-remote-images-d0m3`,
    options: {
      // The node type that has the images you want to grab.
      // This is generally the camelcased version of the word
      // after the 'all' in GraphQL ie. allMyImages type is myImages
      nodeType: 'StripeProduct',
      // For simple object traversal, this is the string path to the image you
      // want to use, relative to the node.
      // This uses lodash .get, see [docs for accepted formats here](https://lodash.com/docs/4.17.11#get).
      // For traversing objects with arrays at given depths, see [how to handle arrays below](#traversing-objects-with-arrays)
      imagePath: 'images',
      name: 'localImages',
      type: 'array',
      // Allows modification of the URL per image if needed. Expects a function
      // taking the original URL as a parameter and returning the desired URL.
      prepareUrl: ({ url, node, index }) => {
        return url
      }
    }
  },
  `gatsby-transformer-remark`,
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,

  `gatsby-plugin-stripe`,
  {
    resolve: `gatsby-source-stripe`,
    options: {
      objects: ['Sku', 'Product'],
      secretKey: process.env.STRIPE_SECRET_KEY,
      downloadFiles: true
    }
  },
  {
    resolve: 'gatsby-plugin-transition-link',
    options: {
      layout: require.resolve(`./src/components/pageWrapper.js`)
    }
  },
  {
    resolve: 'gatsby-plugin-antd',
    options: {
      style: true
    }
  },
  {
    resolve: 'gatsby-plugin-less',
    options: {
      javascriptEnabled: true,
      modifyVars: lessToJs(fs.readFileSync('./src/makramonde.less', 'utf8')) //still needed to override variables properly
    }
  },
  {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      // The property ID; the tracking code won't be generated without it
      trackingId: process.env.GOOGLE_ANALYTICS_ID,
      // Defines where to place the tracking script - `true` in the head and `false` in the body
      head: false,
      // Setting this parameter is optional
      anonymize: true,
      // Setting this parameter is also optional
      respectDNT: true,
      // Delays sending pageview hits on route update (in milliseconds)
      pageTransitionDelay: 0
    }
  },
  'gatsby-plugin-robots-txt',
  {
    resolve: `gatsby-plugin-sitemap`,
    options: {
      exclude: [`/success`],
      query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }

          allSitePage {
            nodes {
              path
              context {
                id
              }
            }
          }

          allStripeProduct {
            nodes {
              id
              localImages {
                publicURL
              }
            }
          }
          
      }`,
      serialize: ({ site, allSitePage, allStripeProduct }) =>
        allSitePage.nodes.map(node => {
          const sitemap = {
            url: `${site.siteMetadata.siteUrl}${node.path}`
          }
          if (!node.context.id) {
            return sitemap
          }
          const product = allStripeProduct.nodes.find(
            ({ id }) => node.context.id === id
          )
          if (!product) {
            return sitemap
          }
          return {
            ...sitemap,
            img: product.localImages.map(({ publicURL }) => ({
              url: `${site.siteMetadata.siteUrl}${publicURL}`
            }))
          }
        })
    }
  },
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `Makramonde ecommerce`,
      short_name: `Makramonde`,
      start_url: `/`,
      background_color: `#1890ff`,
      theme_color: `#1890ff`,
      display: `minimal-ui`,
      icon: `src/images/makramonde-transparent.png`, // This path is relative to the root of the site.
      cache_busting_mode: 'none'
    }
  },
  {
    resolve: 'gatsby-plugin-offline', //should be after gatsby-plugin-manifest
    options: {
      workboxConfig: {
        globPatterns: ['**/*']
      }
    }
  }
]

if (process.env.NODE_ENV !== 'production') {
  plugins.push({
    resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
    options: {
      devMode: true
    }
  })
}

module.exports = {
  siteMetadata: {
    title: `Makramonde | Bijoux uniques en macramé`,
    description: `Aux couleurs du macramé, j'allie l’élégance du métal et de pierres fines. Venez découvrir les dernières créations issues de mon atelier "Makramonde".`,
    author: `Oriane`,
    siteUrl: process.env.URL || 'http://localhost'
  },
  plugins
}
