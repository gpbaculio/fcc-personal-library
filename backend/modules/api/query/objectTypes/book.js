// external imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

import { globalIdField, connectionArgs } from 'graphql-relay'

import { nodeInterface } from '../../definitions';
import { BookType } from '../../../models/constants';

const GraphQLBookType = new GraphQLObjectType({
  name: BookType,
  fields: {
    id: globalIdField(BookType),
    title: {
      type: GraphQLString,
      resolve: ({ title }) => title,
    },
    userId: {
      type: GraphQLString,
      resolve: ({ userId }) => userId,
    },
  },
  interfaces: [nodeInterface],
});

export default GraphQLBookType;