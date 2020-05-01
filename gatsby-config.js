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
  `gatsby-plugin-sitemap`,
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
