// external imports
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions
} from 'graphql-relay'

import GraphQLBookType from './book'

import { getBooks, getBooksCount } from '../../../database'
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
      type: booksConnection,
      args: {
        ...connectionArgs,
        page: {
          type: GraphQLInt
        }
      },
      resolve: async (_root, { page, ...args }) => {
        const books = await getBooks({ page, limit: args.first })
        console.log('books ', books.length)
        console.log('args db', { page, limit: args.first })
        return connectionFromArray(books, args)
      }
    },
    booksCount: {
      type: GraphQLInt,
      resolve: () => {
        return getBooksCount()
      }
    }
  }
})

export default GraphQLUserType
