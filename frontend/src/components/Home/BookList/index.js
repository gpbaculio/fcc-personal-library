import React, { PureComponent, Fragment } from 'react'
import { createRefetchContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import Pagination from 'react-js-pagination';
import { Spinner, Row } from 'reactstrap'

import BookItem from './BookItem'


class BookList extends PureComponent {
  state = { page: 1, loading: false }
  handlePageChange = page => {
    const { loading } = this.state
    if (loading) return
    this.setState({ loading: true })
    this.props.relay.refetch(
      ({ count }) => ({
        count,
        page
      }),
      null,
      () => this.setState({ page, loading: false })
    )
  }

  render() {
    const { page, loading } = this.state
    const { viewer } = this.props
    return (
      <Fragment>
        {loading && (
          <div className='d-flex w-100 justify-content-center'>
            <div className='mb-4'>
              <Spinner size='lg' className='mr-2' color='primary' />
              Loading...
            </div>
          </div>
        )}
        <div className='books-grid-container w-100 d-flex flex-column'>
          <Row>
            {viewer.BookList_viewer_books.edges.map(({ cursor, node }) => (
              <BookItem
                key={node.id}
                book={node}
                cursor={cursor}
                viewer={viewer}
              />
            ))}
          </Row>
          <div className='d-flex w-100 justify-content-center'>
            <Pagination
              activePage={page}
              itemsCountPerPage={6}
              totalItemsCount={viewer.booksCount}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default createRefetchContainer(
  BookList,
  {
    viewer: graphql`
      fragment BookList_viewer on User 
        @argumentDefinitions(
          userId: { type: "String" }
          count: { type: "Int", defaultValue: 6 }
          cursor: { type: "String", defaultValue: null }
          page: { type: "Int", defaultValue: 1 }
        ) {
        ...BookItem_viewer
        id
        profilePicture
        booksCount
        BookList_viewer_books: books(first: $count, page: $page, after: $cursor)
          @connection(key: "Connection_BookList_viewer_books", filters: []) {
          edges {
            cursor
            node {
              id
              ...BookItem_book
            }
          }
        }
      }
    `
  },
  graphql`
    query BookListQuery($count: Int, $page: Int, $cursor: String) {
      viewer {
        ...BookList_viewer @arguments(count: $count, page:$page, cursor: $cursor)
      }
    }
  `
);