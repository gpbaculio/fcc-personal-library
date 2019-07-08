// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'
import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions
} from 'graphql-relay'

import GraphQLBookType from './book'
import GraphQLCommentType from './comment'

import { getUserBooks, getUserComments } from '../../../database'
import { nodeInterface } from '../../definitions'
import { BookType, CommentType } from '../../definitions/constants';

export const {
  connectionType: booksConnection,
  edgeType: GraphQLBookEdge
} = connectionDefinitions({ name: BookType, nodeType: GraphQLBookType });

export const {
  connectionType: commentsConnection,
  edgeType: GraphQLCommentEdge
} = connectionDefinitions({ name: CommentType, nodeType: GraphQLCommentType });

const GraphQLUserType = new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],
  fields: {
    id: globalIdField('User'),
    username: {
      type: GraphQLString,
      resolve: ({ username }) => username
    },
    books: {
      type: booksConnection,
      args: {
        ...connectionArgs,
      },
      resolve: (_root, { ...args }, { user: { _id } }) => connectionFromArray(getUserBooks(_id), args)
    },
    comments: {
      type: commentsConnection,
      args: { ...connectionArgs },
      resolve: (_root, { ...args }, { user: { _id } }) => connectionFromArray(getUserComments(_id), args)
    }
  }
})

export default GraphQLUserType
