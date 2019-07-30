import graphql from 'babel-plugin-relay/macro';

import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription bookAddedSubscription($viewerId: String, $count: Int, $cursor: String) {
    bookAdded(viewerId: $viewerId) {
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
          comments(first: $count, after: $cursor)
          @connection(key: "BookComments_comments") {
            __typename
            edges { 
              node { 
                id
              }
            }
          }
        }
      }
    }
  }
`)
