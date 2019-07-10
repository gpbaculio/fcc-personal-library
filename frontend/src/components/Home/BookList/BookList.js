import React, { Component } from 'react'
import { createRefetchContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

export class BookList extends Component {
  loadMore = () => {
    const refetchVariables = fragmentVariables => {
      return ({
        count: fragmentVariables.count + 10,
      })
    };
    this.props.relay.refetch(refetchVariables);
  }
  render() {
    console.log('props.books', this.props.books)
    return (
      <div>
        <ul>

        </ul>
        <button
          onPress={this.loadMore}
          title="Load More"
        />
      </div>
    );
  }
}

export const BookListRefetchContainer = createRefetchContainer(
  BookList,
  {
    books: graphql`
      fragment BookList_books on User
      @argumentDefinitions(
        count: {type: "Int", defaultValue: 10}
      ) {
        books(first: $count) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `
  },
  graphql`
    query BookListRefetchQuery($count: Int) {
      viewer {
        ...BookList_books @arguments(count: $count)
      }
    }
  `,
);