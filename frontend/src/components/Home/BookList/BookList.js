import React, { Component } from 'react'
import { createRefetchContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

class BookList extends Component {
  render() {
    console.log('viewer ', this.props.viewer.books)
    return (
      <div>
        <ul>
          {this.props.viewer.books.edges.map(({ node }) => <li key={node.id}>{node.title}</li>)}
        </ul>
      </div>
    );
  }
}

export default createRefetchContainer(
  BookList,
  graphql`
    fragment BookList_viewer on User
    @argumentDefinitions(count: {type: "Int"}, cursor: {type: "String"}) {
      id
      books(first: $count, after: $cursor) @connection(key: "User_books") {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `,
  graphql`
    query BookListRefetchQuery($count: Int!, $cursor:String) {
      viewer {
        id
        ...BookList_viewer @arguments(count: $count, cursor: $cursor)
      }
    }
  `
);