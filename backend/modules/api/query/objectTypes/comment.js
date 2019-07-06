// external imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

import { globalIdField } from 'graphql-relay'

import { nodeInterface } from '../../definitions';
import GraphQLUserType from './user';

const GraphQLCommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    id: globalIdField('Comment'),
    comment: {
      type: GraphQLString,
      resolve: ({ comment }) => comment,
    },
  },
});

export default GraphQLCommentType;