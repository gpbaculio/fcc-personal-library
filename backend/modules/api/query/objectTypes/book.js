// external imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
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
import { getBookComments, getBookCommentsCount } from '../../../database';
import GraphQLCommentType from './comment';
import { CommentType } from '../../definitions/constants';
import GraphQLUserType from './user';

export const {
  connectionType: commentsConnection,
  edgeType: GraphQLCommentEdge
} = connectionDefinitions({ name: CommentType, nodeType: GraphQLCommentType });

const GraphQLBookType = new GraphQLObjectType({
  name: BookType,
  fields: () => ({
    id: globalIdField(BookType),
    title: {
      type: GraphQLString,
      resolve: ({ title }) => title,
    },
    owner: {
      name: 'BookOwner',
      type: GraphQLUserType,
      resolve: ({
        userId: {
          _id, username, profilePicture
        }
      }) => {
        return ({ id: `${_id}`, username, profilePicture })
      },
      fields: () => ({
        id: globalIdField('BookOwner'),
        username: {
          type: GraphQLString,
          resolve: ({ username }) => username
        },
        profilePicture: {
          type: GraphQLString,
          resolve: ({ profilePicture }) => profilePicture || 'default'
        },
      })
    },
    comments: {
      type: commentsConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async ({ _id }, { ...args }) => {
        const comments = await getBookComments(_id)
        console.log('comments ', comments)
        console.log('args ', args)
        return connectionFromArray(comments, args)
      }
    },
    commentsCount: {
      type: GraphQLInt,
      resolve: ({ _id }) => {
        return getBookCommentsCount(_id)
      }
    },
    createdAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => createdAt,
    }
  }),
  interfaces: [nodeInterface],
});

export default GraphQLBookType;