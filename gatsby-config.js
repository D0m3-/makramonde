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
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `gatsby-starter-default`,
      short_name: `starter`,
      start_url: `/`,
      background_color: `#663399`,
      theme_color: `#663399`,
      display: `minimal-ui`,
      icon: `src/images/makramonde-transparent.png` // This path is relative to the root of the site.
    }
  },
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
  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
]

if(process.env.NODE_ENV !== "production"){
  plugins.push({
    resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
    options: {
      devMode: true,
    },
  },)
}


module.exports = {
  siteMetadata: {
    title: `Makramonde`,
    description: `Bijoux uniques en macramé`,
    author: `@d0m3-`
  },
  plugins
}
