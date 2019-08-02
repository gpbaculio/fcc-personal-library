import graphql from 'babel-plugin-relay/macro';

import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription commentDeletedSubscription {
    commentDeleted {
      deletedCommentId 
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
