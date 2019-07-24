import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation UpdateCommentTextMutation($input: UpdateCommentTextInput!) {
    updateCommentText(input: $input) {
      comment {
        __typename
        cursor
        node { id text }
      }
    }
  }
`)
