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
    title: `Makramonde`,
    description: `Bijoux uniques en macramé`,
    author: `@d0m3-`
  },
  plugins
}
