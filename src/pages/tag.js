import { FaTag } from 'react-icons/fa/'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'gatsby'
import { ThemeContext } from '../layouts'
import Article from '../components/Article'
import Headline from '../components/Article/Headline'
import List from '../components/List'
import Seo from '../components/Seo'

const TagPage = props => {
  const {
    data: {
      posts: { edges: posts },
      site: {
        siteMetadata: { facebook },
      },
    },
  } = props

  // Create tag list
  const tagPosts = {}
  posts.forEach(edge => {
    const {
      node: {
        frontmatter: { tags },
      },
    } = edge

    if (tags && tags != null) {
      tags.forEach(tag => {
        if (tag && tag != null) {
          if (!tagPosts[tag]) {
            tagPosts[tag] = []
          }
          tagPosts[tag].push(edge)
        }
      })
    }
  })

  const tagList = []

  for (const tag in tagPosts) {
    tagList.push([tag, tagPosts[tag]])
  }

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <header>
              <Headline title="Posts by tags" theme={theme} />
            </header>
            <div className="flexbox">
              {tagList.map(item => (
                <section key={item[0]} className="box">
                  <a href={'#' + item[0]}>
                    <FaTag /> {item[0]} ({item[1].length})                
                  </a>
                </section>
              ))}
            </div>

            {tagList.map(item => (
              <section key={item[0]} id={item[0]}>
                <h2>
                  {item[0]} ({item[1].length})
                </h2>
                <List edges={item[1]} theme={theme} />
              </section>
            ))}
            {/* --- STYLES --- */}
            <style jsx>{`
              h2 {
                margin: 0 0 0.5em;
              }
              h2 :global(svg) {
                height: 0.8em;
                fill: ${theme.color.brand.primary};
              }
              .flexbox{
                display: -webkit-flex;
                -webkit-flex-direction: row;
                -webkit-flex-wrap: wrap;
                width: auto;
                margin: 0 0 3rem 0;
              }
              .box {
                -webkit-flex: auto;
                margin: 0 0 1rem 0;
              }
            `}</style>
          </Article>
        )}
      </ThemeContext.Consumer>

      <Seo facebook={facebook} />
    </React.Fragment>
  )
}

TagPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default TagPage

// eslint-disable-next-line no-undef
export const query = graphql`
  query PostsQuery {
    posts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" }
        frontmatter: { published: { eq: true } }
      }
      sort: { fields: [fields___prefix], order: DESC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            prefix
          }
          frontmatter {
            title
            tags
            author
            cover {
              children {
                ... on ImageSharp {
                  fluid(maxWidth: 800, maxHeight: 360) {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
              }
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        facebook {
          appId
        }
      }
    }
  }
`
