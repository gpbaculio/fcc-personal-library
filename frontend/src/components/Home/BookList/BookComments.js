import React, { Component } from 'react'
import { createPaginationContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import CommentInput from './CommentInput';
import { Button } from 'reactstrap'
import Comment from './Comment';

export class BookComments extends Component {
  state = { hasMore: false, loading: false }
  componentDidMount() {
    const hasMore = this.props.relay.hasMore()
    this.setState({ hasMore, loading: false })
  }
  componentDidUpdate(prevProps) {
    if (prevProps.book.id !== this.props.book.id) {
      const hasMore = this.props.relay.hasMore()
      this.setState({ hasMore, loading: false })
    }
  }
  loadMore = () => {
    const hasMore = this.props.relay.hasMore()
    const isLoading = this.props.relay.isLoading()
    this.setState({ hasMore, loading: true })
    if (!hasMore || isLoading) {
      this.setState({ loading: false })
      return;
    } else {
      this.props.relay.loadMore(
        4,
        () => {
          const hasMore = this.props.relay.hasMore()
          this.setState({ loading: false, hasMore })
        }
      );
    }
  }
  render() {
    const { book, viewer } = this.props
    const { hasMore, loading } = this.state
    return (
      <div className='p-3 comments-container'>
        <CommentInput viewerId={viewer.id} bookId={book.id} />
        <ul className='mt-1'>
          {book.comments.edges.map(({ node, cursor }) => (
            <Comment
              cursor={cursor}
              key={cursor}
              comment={node}
              bookId={book.id}
              viewerId={viewer.id}
            />
          ))}
        </ul>
        <Button
          disabled={!hasMore || loading}
          color="primary"
          size="sm"
          onClick={this.loadMore}
        >
          Load more
        </Button>
      </div>
    )
  }
}

export default createPaginationContainer(
  BookComments,
  {
    viewer: graphql`
      fragment BookComments_viewer on User {
        id
      }
    `,
    book: graphql`
      fragment BookComments_book on Book 
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 3 }
        cursor: { type: "String", defaultValue: null }
      ) {
        id
        title
        commentsCount
        owner {
          id
        }
        comments(first: $count, after: $cursor)
          @connection(key: "BookComments_comments") {
            __typename
          edges {
            node {
              id
              text
              owner {
                id
                username
                profilePicture
              }
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
    getFragmentVariables: (prevVars, totalCount) => ({ ...prevVars, count: totalCount }),
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
