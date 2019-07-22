import React, { Component, Fragment } from 'react'
import { createRefetchContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import Pagination from 'react-js-pagination';
import { Spinner } from 'reactstrap'
import BookItem from './BookItem'

class BookList extends Component {
  state = {
    page: 1,
    loading: false
  }
  handlePageChange = async (page) => {
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
    console.log('BookList_viewer_books ', viewer.BookList_viewer_books)
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
          <div className='grid-container'>
            {viewer.BookList_viewer_books.edges.map(({ node }, idx) => (
              <BookItem
                key={idx}
                viewerId={viewer.id}
                book={node}
              />
            ))}
          </div>
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
        count: { type: "Int", defaultValue: 6 }
        cursor: { type: "String", defaultValue: null }
        page: { type: "Int", defaultValue: 1 }
      ){
        id
        profilePicture
        booksCount
        BookList_viewer_books: books(first: $count, page: $page, after: $cursor)
          @connection(key: "Show_BookList_viewer_books", filters: []) {
          edges {
            cursor
            node {
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