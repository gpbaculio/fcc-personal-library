// external imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

import { globalIdField } from 'graphql-relay'

import { nodeInterface } from '../../definitions';

const GraphQLBookType = new GraphQLObjectType({
  name: 'Book',
  fields: {
    id: globalIdField('Book'),
    title: {
      type: GraphQLString,
      resolve: ({ likerId }) => likerId,
    },
    comments: {
      type: GraphQLBoolean,
      resolve: ({ seen }) => seen,
    },
  },
  interfaces: [nodeInterface],
});

export default GraphQLBookType;