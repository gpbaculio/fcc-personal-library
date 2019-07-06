// external imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

import { globalIdField, connectionArgs } from 'graphql-relay'

import { nodeInterface } from '../../definitions';
import { commentsConnection } from './user';
import { getBookComments } from '../../../database';

const GraphQLBookType = new GraphQLObjectType({
  name: 'Book',
  fields: {
    id: globalIdField('Book'),
    title: {
      type: GraphQLString,
      resolve: ({ title }) => title,
    },
  },
  interfaces: [nodeInterface],
});

export default GraphQLBookType;