import React from 'react'
import { graphql, Link } from 'gatsby'
import * as _ from 'lodash'
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion'
import { withPlugin } from 'tinacms'
import { RemarkCreatorPlugin } from 'gatsby-tinacms-remark'

import Layout from '../components/layout'
import './index.css'

const IndexPage = props => {
  const notes = props.data.allMarkdownRemark
  const subjects = _.chain(notes.edges)
    .groupBy(node => node.node.fields.slug.split('/')[1])
    .map(node => node) //using ES6 shorthand to generate the objects
    .value()
  console.log(subjects)
  return (
    <Layout>
      <h2 style={{ textAlign: 'center', fontFamily: 'courier, monospace' }}>
        Subjects
      </h2>
      <Accordion>
        {subjects.map((arr, i) => (
          <AccordionItem key={arr[0].node.fields.slug.split('/')[1]}>
            <AccordionItemTitle>
              {arr[0].node.fields.slug.split('/')[1].toUpperCase()}
            </AccordionItemTitle>
            {arr.map(({ node }, j) => (
              <AccordionItemBody key={node.frontmatter.title}>
                <Link to={node.fields.slug} className="link">
                  <div className="post-list">{node.frontmatter.title}</div>
                </Link>
              </AccordionItemBody>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </Layout>
  )
}

const CreatePostPlugin = new RemarkCreatorPlugin({
  label: 'Create Post',
  fields: [
    {
      name: 'filename',
      component: 'text',
      label: 'Filename',
      placeholder: 'content/blog/hello-world/index.md',
      description:
        'The full path to the new markdown file, relative to the repository root.',
    },
  ],
  filename: form => {
    return form.filename
  },
})

export default withPlugin(IndexPage, CreatePostPlugin)

export const query = graphql`
  query ListQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
