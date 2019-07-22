import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation AddCommentMutation($input: AddCommentInput!) {
    addComment(input: $input) {
      comment {
        __typename
        cursor
        node {
          id
          text
          owner {
            username
            profilePicture
          }
          createdAt
        }
      }
    }
  }
`)
