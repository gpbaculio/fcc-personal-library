import React, { Component, Fragment } from 'react'
import { createPaginationContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import CommentInput from './CommentInput';

export class BookComments extends Component {
  loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }
    this.props.relay.loadMore(3);
  }
  render() {
    const {
      book: { id: bookId, comments },
      viewerId
    } = this.props
    return (
      <div className='p-3 comments-container'>
        <CommentInput viewerId={viewerId} bookId={bookId} />
        {comments.edges.length && (
          <Fragment>
            <ul>
              {comments.edges.map(({ node }) => <li key={node.id}>{node.text}</li>)}
            </ul>
            <button onClick={() => this.loadMore()}>
              load more
            </button>
          </Fragment>
        )}
      </div>
    )
  }
}

export default createPaginationContainer(
  BookComments,
  {
    book: graphql`
      fragment BookComments_book on Book 
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 3 }
        cursor: { type: "String", defaultValue: null }
      ) {
        id
        title
        comments(first: $count, after: $cursor)
          @connection(key: "BookComments_comments") {
            __typename
          edges {
            node {
              id
              text
              owner
              createdAt
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps: (props) => props.book && props.book.comments,
    getFragmentVariables: (prevVars, totalCount) => ({
      ...prevVars,
      count: totalCount
    }),
    getVariables: (props, { count, cursor }, _fragmentVariables) => ({
      count,
      cursor,
      id: props.book.id
    }),
    query: graphql`
      query BookCommentsQuery($id: ID!, $count: Int, $cursor: String) {
        book: node(id: $id) {
          ...BookComments_book @arguments(count: $count, cursor: $cursor)
        }
      }
    `
  }
);
