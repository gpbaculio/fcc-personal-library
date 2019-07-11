import React, { Component } from 'react'
import { createRefetchContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import BookItem from './BookItem'


class BookListContainer extends Component {
  render() {
    const { viewer } = this.props
    return (
      <React.Fragment>
        {viewer.books.edges.map(({ node }) => (
          <BookItem viewerId={viewer.id} key={node.id} book={node} />))}
      </React.Fragment>
    );
  }
}

export default createRefetchContainer(
  BookListContainer,
  {
    viewer: graphql`
      fragment BookListContainer_viewer on User {
        id
        books(first: $count, after: $cursor)
          @connection(key: "BookList_books", filters: []) {
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
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.books;
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
        cursor
      };
    },
    query: graphql`
      query BookListContainerQuery($count: Int, $cursor: String) {
        viewer {
          ...BookListContainer_viewer
        }
      }
    `
  }
);