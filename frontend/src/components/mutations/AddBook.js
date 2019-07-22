import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation AddBookMutation($input: AddBookInput! $count: Int $cursor: String ) {
    addBook(input: $input) {
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
