import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      token
      error
    }
  }
`)
