import { GraphQLNonNull, GraphQLString } from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';


import { generateToken } from '../../auth';
import { findUsername, saveUser } from '../../database';

const GraphQLSignupMutation = mutationWithClientMutationId({
  name: 'Signup',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ username, password }) => {
    const user = await findUsername(username);
    if (user) return ({ token: null, error: 'Email already taken' });
    const newUser = saveUser({ username, password })
    return ({ token: generateToken(newUser), error: null });
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});

export default GraphQLSignupMutation;
