import graphql from 'babel-plugin-relay/macro';

import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription bookAddedSubscription($count: Int = 3, $cursor: String = null)   {
    bookAdded {
      book {
        __typename
        cursor
        node {
          id
          title
          owner {
            username
            profilePicture
          }
          createdAt
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
