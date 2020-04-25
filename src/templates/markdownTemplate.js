import React from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/seo'
import { SwipeSpring } from '../components/animation/swipe'
export default function Template({
  data, // this prop will be injected by the GraphQL query below.
  location
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <>
      <SEO title={frontmatter.title} location={location} />
      <SwipeSpring>
        {() => <div dangerouslySetInnerHTML={{ __html: html }} />}
      </SwipeSpring>
    </>
  )
}
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`
