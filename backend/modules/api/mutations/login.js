import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { generateToken } from '../../auth';
import { findUsername } from '../../database';

const GraphQLLoginMutation = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ username, password }) => {
    const user = await findUsername(username);
    if (!user) return ({ token: null, error: 'Invalid credentials' });
    const correctPassword = user.authenticate(password);
    if (!correctPassword) return { token: null, error: 'Invalid credentials' };
    return ({ token: generateToken(user), error: null });
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

export default GraphQLLoginMutation;
