
import { createPaginationContainer } from 'react-relay'
import React, { Component, Fragment } from 'react'
import graphql from 'babel-plugin-relay/macro';
import { Row, Col } from 'reactstrap'
import BookItem from '../Home/BookList/BookItem';

class ProfileBooks extends Component {
  render() {
    const { viewer } = this.props
    return (
      <Fragment>
        <Row>
          {viewer.ProfileBooks_viewer_books.edges.map(({ node, cursor }) => (
            <Col xs='12' key={cursor}>
              <div className='mx-auto my-2 profile-book-item d-flex justify-content-center'>
                <BookItem
                  viewer={viewer}
                  book={node}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Fragment>
    )
  }
}

export default createPaginationContainer(
  ProfileBooks,
  {
    viewer: graphql`
      fragment ProfileBooks_viewer on User 
        @argumentDefinitions(
          userId: { type: "String" }
          count: { type: "Int", defaultValue: 3 }
          cursor: { type: "String", defaultValue: null }
          page: { type: "Int", defaultValue: 1 }
        ) {
        id
        ...BookItem_viewer
        profilePicture
        booksCount
        username
        ProfileBooks_viewer_books: books(first: $count, page: $page, after: $cursor, userId: $userId)
          @connection(key: "Connection_ProfileBooks_viewer_books", filters: []) {
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
  {
    direction: 'forward',
    getConnectionFromProps: (props) => props.viewer && props.viewer.ProfileBooks_viewer_books,
    getFragmentVariables: (prevVars, totalCount) => ({
      ...prevVars,
      count: totalCount
    }),
    getVariables: (_props, { count, cursor }, _fragmentVariables) => ({
      count,
      cursor
    }),
    query: graphql`
      query ProfileBooksQuery($count: Int, $page: Int, $cursor: String, $userId: String) {
        viewer {
          ...ProfileBooks_viewer @arguments(count: $count, page:$page, cursor: $cursor, userId: $userId)
        }
      }
    `
  }
);