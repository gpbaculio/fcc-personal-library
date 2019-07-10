import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation AddBookMutation($input: AddBookInput!) {
    addBook(input: $input) {
      book {
        __typename
        cursor
        node {
          id
          title
          userId
        }
      }
    }
  }
`)
