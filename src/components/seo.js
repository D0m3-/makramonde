/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

/**
 *
 * @param {Object} param
 * @param {string} [param.description]
 * @param {string} param.lang
 * @param {Object[]} [param.meta]
 * @param {string} [param.title]
 * @param {string} [param.image]
 * @param {Object} param.location
 */
function SEO({ description, lang, meta, title, image, location }) {
  const { site, defaultImage } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
        defaultImage: file(relativePath: { eq: "makramonde-bijou.png" }) {
          childImageSharp {
            resize(width: 600, height: 350, cropFocus: NORTH) {
              src
            }
          }
        }
      }
    `
  )

  const pageTitle =
    (title && `${title} | Makramonde`) || site.siteMetadata.title
  const metaDescription = description || site.siteMetadata.description
  const metaImage = image || defaultImage.childImageSharp.resize.src

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={pageTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:url`,
          content: `${site.siteMetadata.siteUrl}${location.pathname}`
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:image`,
          content: metaImage
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author
        },
        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: metaDescription
        }
      ].concat(meta)}
    >
      <link
        rel="canonical"
        href={`${site.siteMetadata.siteUrl}${location.pathname}`}
      />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired
}

export default SEO
