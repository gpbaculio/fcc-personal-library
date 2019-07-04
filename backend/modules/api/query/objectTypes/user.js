// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'
import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions
} from 'graphql-relay'

import { getCommentsByUser, getBooksByUser } from '../../../database'
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
  fields: () => ({
    id: globalIdField('User'),
    displayName: {
      type: GraphQLString,
      resolve: ({ displayName }) => displayName
    },
    books: {
      type: booksConnection,
      args: {
        ...connectionArgs,
      },
      resolve: (_root, { ...args }, { user: { _id } }) => connectionFromArray(getBooksByUser(_id), args)
    },
    comments: {
      type: commentsConnection,
      args: { userId: { type: GraphQLString }, ...connectionArgs },
      resolve: (_root, { ...args }, { user: { _id } }) => connectionFromArray(getCommentsByUser(_id), args)
    }
  })
})

export default GraphQLUserType
