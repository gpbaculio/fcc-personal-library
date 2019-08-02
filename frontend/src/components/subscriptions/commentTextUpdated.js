import graphql from 'babel-plugin-relay/macro';

import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription commentTextUpdatedSubscription($commentId: String!) {
    commentTextUpdated(commentId: $commentId) {
      comment {
        __typename
        cursor
        node {
          id
          text
        }
      }
    }
  }
`)