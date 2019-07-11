// external imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

import { globalIdField } from 'graphql-relay'

const GraphQLCommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    id: globalIdField('Comment'),
    text: {
      type: GraphQLString,
      resolve: ({ text }) => text,
    },
    owner: {
      type: GraphQLString,
      resolve: ({ userId: { username } }) => username,
    },
    createdAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => createdAt,
    }
  },
});

export default GraphQLCommentType;