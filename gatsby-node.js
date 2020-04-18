//const webpack = require("webpack");
const _ = require('lodash')
const path = require('path')
const Promise = require('bluebird')

const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode })
    const fileNode = getNode(node.parent)
    const source = fileNode.sourceInstanceName
    const separtorIndex = ~slug.indexOf('--') ? slug.indexOf('--') : 0
    const shortSlugStart = separtorIndex ? separtorIndex + 2 : 0

    if (source !== 'parts') {
      createNodeField({
        node,
        name: `slug`,
        value: `${separtorIndex ? '/' : ''}${slug.substring(shortSlugStart)}`,
      })
    }
    createNodeField({
      node,
      name: `prefix`,
      value: separtorIndex ? slug.substring(1, separtorIndex) : '',
    })
    createNodeField({
      node,
      name: `source`,
      value: source,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('./src/templates/PostTemplate.js')
    const pageTemplate = path.resolve('./src/templates/PageTemplate.js')
    const tagTemplate = path.resolve('./src/templates/TagTemplate.js')

    resolve(
      graphql(
        `
          {
            allMdx(
              filter: { fields: { slug: { ne: null } }, frontmatter: { published: { eq: true } } }
              sort: { fields: [fields___prefix], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  id
                  fields {
                    slug
                    prefix
                    source
                  }
                  frontmatter {
                    title
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const items = result.data.allMdx.edges

        // Create tag list
        const tagSet = new Set()
        items.forEach(edge => {
          const {
            node: {
              frontmatter: { tags },
            },
          } = edge

          if (tags && tags != null) {
            tags.forEach(tag => {
              if (tag && tag !== null) {
                tagSet.add(tag)
              }
            })
          }
        })

        // Create tag pages
        const tagList = Array.from(tagSet)
        tagList.forEach(tag => {
          createPage({
            path: `/tag/${_.kebabCase(tag)}/`,
            component: tagTemplate,
            context: {
              tag,
            },
          })
        })

        // Create posts
        const posts = items.filter(item => item.node.fields.source === 'posts')
        posts.forEach(({ node }, index) => {
          const slug = node.fields.slug
          const next = index === 0 ? undefined : posts[index - 1].node
          const prev = index === posts.length - 1 ? undefined : posts[index + 1].node
          const source = node.fields.source

          createPage({
            path: slug,
            component: postTemplate,
            context: {
              slug,
              prev,
              next,
              source,
            },
          })
        })

        // and pages.
        const pages = items.filter(item => item.node.fields.source === 'pages')
        pages.forEach(({ node }) => {
          const slug = node.fields.slug
          const source = node.fields.source

          createPage({
            path: slug,
            component: pageTemplate,
            context: {
              slug,
              source,
            },
          })
        })

        // Create blog post list pages
        const postsPerPage = 5
        const numPages = Math.ceil(posts.length / postsPerPage)

        _.times(numPages, i => {
          createPage({
            path: i === 0 ? `/` : `/${i + 1}`,
            component: path.resolve('./src/templates/index.js'),
            context: {
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages,
              currentPage: i + 1,
            },
          })
        })
      })
    )
  })
}

exports.onCreateWebpackConfig = ({ stage, actions, loaders }, options) => {
  switch (stage) {
    case `build-javascript`:
    // actions.setWebpackConfig({
    //   module: {
    //     rules: [
    //       {
    //         test: /\.css$/,
    //         use: [loaders.style(), loaders.css({ importLoaders: 1 }), loaders.postcss()],
    //       },
    //     ],
    //   },
    // })
  }
}
