import graphql from 'babel-plugin-relay/macro';

import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription commentAddedSubscription($bookId: String!) {
    commentAdded(bookId: $bookId) {
      comment {
        __typename
        cursor
        node {
          id
          text
          owner {
            username
            profilePicture
          }
          createdAt
        }
      }
      book {
        __typename
        cursor
        node {
          id
          commentsCount
        }
      }
    }
  }
`)