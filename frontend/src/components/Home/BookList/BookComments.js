import React, { Component } from 'react'
import { createPaginationContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import CommentInput from './CommentInput';

export class BookComments extends Component {
  render() {
    const { book, viewerId } = this.props
    return (
      <div className='p-3 comments-container'>
        <CommentInput viewerId={viewerId} bookId={book.id} />
        {book.comments.edges.length && <ul>
          {book.comments.edges.map(({ node }) => <li key={node.id}>{node.text}</li>)}
        </ul>}
      </div>
    )
  }
}

export default createPaginationContainer(
  BookComments,
  {
    book: graphql`
      fragment BookComments_book on Book {
        id
        comments(first: $count, after: $cursor)
          @connection(key: "BookComments_comments", filters: []) {
          edges {
            node {
              id
              text
              owner
              createdAt
            }
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.book && props.book.comments;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        id: props.book.id
      };
    },
    query: graphql`
      query BookCommentsQuery($id: ID!, $count: Int, $cursor: String) {
        book: node(id: $id) {
          ...BookComments_book
        }
      }
    `
  }
);
