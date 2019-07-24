import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation UpdateBookTitleMutation($input: UpdateBookTitleInput!) {
    updateBookTitle(input: $input) {
      book {
        __typename
        cursor
        node { id title }
      }
    }
  }
`)
