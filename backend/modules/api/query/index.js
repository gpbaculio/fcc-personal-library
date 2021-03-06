import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'

import GraphQLUserType from './objectTypes/user';
import { nodeField } from '../definitions'
import { getUser } from '../../database';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: GraphQLUserType,
      args: {
        userId: { type: GraphQLString }
      },
      resolve: (_root, { userId }, { user }) => {
        if (userId)
          return getUser(userId)
        else if (user)
          return user
        else
          return 'guest'
      },
    },
    node: nodeField,
  })
});

export default query
