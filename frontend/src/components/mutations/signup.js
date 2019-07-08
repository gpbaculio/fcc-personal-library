import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation SignupMutation($input: SignupInput!) {
    signup(input: $input) {
      token
      error
    }
  }
`)
