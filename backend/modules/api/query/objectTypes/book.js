// external imports
import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  fromGlobalId,
  connectionDefinitions
} from 'graphql-relay'

import { nodeInterface } from '../../definitions';
import { BookType } from '../../../models/constants';
import { getBookComments } from '../../../database';
import GraphQLCommentType from './comment';
import { CommentType } from '../../definitions/constants';

export const {
  connectionType: commentsConnection,
  edgeType: GraphQLCommentEdge
} = connectionDefinitions({ name: CommentType, nodeType: GraphQLCommentType });

const GraphQLBookType = new GraphQLObjectType({
  name: BookType,
  fields: {
    id: globalIdField(BookType),
    title: {
      type: GraphQLString,
      resolve: ({ title }) => title,
    },
    owner: {
      type: GraphQLString,
      resolve: ({ userId: { username } }) => username,
    },
    comments: {
      type: commentsConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async ({ _id }, { ...args }) => {
        const comments = await getBookComments(_id)
        return connectionFromArray(comments, args)
      }
    },
    createdAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => createdAt,
    }
  },
  interfaces: [nodeInterface],
});

export default GraphQLBookType;