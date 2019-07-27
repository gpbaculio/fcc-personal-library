import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation DeleteBookMutation($input: DeleteBookInput!) {
    deleteBook(input: $input) {
      deletedBookId
      viewer {
        booksCount
      }
    }
  }
`)
