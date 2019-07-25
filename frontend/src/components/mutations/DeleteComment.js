import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation DeleteCommentMutation($input: DeleteCommentInput!)  {
    deleteComment(input: $input) {
      book {
        __typename
        cursor
        node {
          id
          commentsCount
        }
      }
      deletedCommentId 
    }
  }
`)
