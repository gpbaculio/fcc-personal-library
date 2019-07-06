import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'

import GraphQLUserType from './objectTypes/user';
import { nodeField } from '../definitions'

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: GraphQLUserType,
      resolve: async (_root, _args, { user }) => {
        return { displayName: 'Shela' }
      },
    },
    node: nodeField,
  })
});

export default query
