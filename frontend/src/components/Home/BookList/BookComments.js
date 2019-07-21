import React, { Component, Fragment } from 'react'
import { createPaginationContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import CommentInput from './CommentInput';
import { timeDifferenceForDate } from './utils';

export class BookComments extends Component {
  loadMore = () => {
    console.log('loadmore', this.props.relay.hasMore())
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }
    this.props.relay.loadMore(4);
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
            <ul className='mt-1'>
              {comments.edges.map(({ node }) => (
                <li className='comment d-flex w-100 justify-content-between' key={node.id}>
                  <img alt='' src={`${process.env.PUBLIC_URL}/images/${node.ownerProfilePic}`} width='35' height='35' />
                  <span>{node.text}</span>
                  <p>{timeDifferenceForDate(node.createdAt)}</p>
                </li>
              ))}
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
              ownerProfilePic
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
