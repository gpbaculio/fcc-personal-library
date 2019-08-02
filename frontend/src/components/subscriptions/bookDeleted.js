import graphql from 'babel-plugin-relay/macro';

import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription bookDeletedSubscription {
    bookDeleted {
      deletedBookId
    }
  }
`)
