import graphql from 'babel-plugin-relay/macro';

import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription bookTitleUpdatedSubscription($bookId: String!) {
    bookTitleUpdated(bookId: $bookId) {
      book {
        __typename
        cursor
        node {
          id
          title
        }
      }
    }
  }
`)