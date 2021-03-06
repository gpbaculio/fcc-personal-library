import graphql from 'babel-plugin-relay/macro';

import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription bookAddedSubscription {
    bookAdded {
      book {
        __typename
        cursor
        node {
          id
          title
          owner {
            id
            username
            profilePicture
          }
          createdAt
          commentsCount
        }
      }
    }
  }
`)
