import React, { Component } from 'react'
import { fromGlobalId } from 'graphql-relay'
import { createPaginationContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import classNames from 'classnames'
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
  refetchEdges = () => {
    this.props.relay.refetchConnection(this.props.book.comments.edges.length)
  }
  render() {
    const { book, viewer } = this.props
    const { hasMore, loading } = this.state
    return (
      <div className={classNames('p-3 comments-container', { 'hide': !fromGlobalId(viewer.id).id })}>
        <CommentInput viewerId={viewer.id} bookId={book.id} />
        <ul className='mt-1'>
          {book.comments.edges.map(({ node, cursor }) => (
            <Comment
              refetchedges={this.refetchEdges}
              cursor={cursor}
              key={node.id}
              comment={node}
              bookId={book.id}
              viewer={viewer}
            />
          ))}
        </ul>
        <Button
          className={classNames({ 'hide': !hasMore })}
          disabled={loading}
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
        ...Comment_viewer
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
          @connection(key: "BookComments_comments", filters: []) {
            __typename
          edges {
            node {
              id
              ...Comment_comment
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
    getVariables: (props, args, _fragmentVariables) => ({
      count: args.count,
      cursor: args.cursor,
      bookId: fromGlobalId(props.book.id).id
    }),
    query: graphql`
      query BookCommentsQuery($bookId: String!, $count: Int, $cursor: String) {
        viewer {
          book(bookId: $bookId) {
            ...BookComments_book @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `
  }
);
