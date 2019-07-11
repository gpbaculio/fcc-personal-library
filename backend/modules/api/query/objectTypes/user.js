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

import { getUserBooks } from '../../../database'
import { nodeInterface } from '../../definitions'
import { BookType, CommentType, UserType } from '../../definitions/constants';

export const {
  connectionType: booksConnection,
  edgeType: GraphQLBookEdge
} = connectionDefinitions({ name: BookType, nodeType: GraphQLBookType });

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
      name: 'Books',
      type: booksConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (_root, { ...args }, { user: { _id } }) => {
        const books = await getUserBooks(_id)
        return connectionFromArray(books, args)
      }
    }
  }
})

export default GraphQLUserType
