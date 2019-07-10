// external imports
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
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
import { BookType, CommentType, UserType } from '../../definitions/constants';

export const {
  connectionType: booksConnection,
  edgeType: GraphQLBookEdge
} = connectionDefinitions({ name: BookType, nodeType: GraphQLBookType });

export const {
  connectionType: commentsConnection,
  edgeType: GraphQLCommentEdge
} = connectionDefinitions({ name: CommentType, nodeType: GraphQLCommentType });

const GraphQLUserType = new GraphQLObjectType({
  name: UserType,
  interfaces: [nodeInterface],
  fields: {
    id: globalIdField(UserType),
    username: {
      type: GraphQLString,
      resolve: ({ username }) => username
    },
    books: {
      type: booksConnection,
      args: {
        ...connectionArgs,
        first: {
          type: GraphQLInt
        }
      },
      resolve: (_root, { first, ...args }, { user: { _id } }) => {
        console.log('args ', first) // first = limit, after = skip/offset
        return connectionFromArray(getUserBooks(_id), args)
      }
    },
    comments: {
      type: commentsConnection,
      args: { ...connectionArgs },
      resolve: (_root, { ...args }, { user: { _id } }) => connectionFromArray(getUserComments(_id), args)
    }
  }
})

export default GraphQLUserType
