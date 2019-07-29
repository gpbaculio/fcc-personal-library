// external imports
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions
} from 'graphql-relay'

import GraphQLBookType from './book'

import { getBooks, getBooksCount, getBook } from '../../../database'
import { nodeInterface } from '../../definitions'
import { BookType, UserType } from '../../definitions/constants';

export const {
  connectionType: booksConnection,
  edgeType: GraphQLBookEdge
} = connectionDefinitions({ name: BookType, nodeType: GraphQLBookType });

const GraphQLUserType = new GraphQLObjectType({
  name: UserType,
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(UserType),
    username: {
      type: GraphQLString,
      resolve: ({ username }) => username
    },
    profilePicture: {
      type: GraphQLString,
      resolve: ({ profilePicture }) => profilePicture || 'default'
    },
    books: {
      type: booksConnection,
      args: {
        ...connectionArgs,
        page: {
          type: GraphQLInt
        },
        searchText: {
          type: GraphQLString
        },
        userId: {
          type: GraphQLString
        }
      },
      resolve: async (_root, { page, searchText, userId, ...args }) => {
        const books = await getBooks({ page, limit: args.first, searchText, userId })
        return connectionFromArray(books, args)
      }
    },
    book: {
      type: GraphQLBookType,
      args: {
        bookId: {
          type: GraphQLString
        }
      },
      resolve: async (_root, { bookId }) => {
        const book = await getBook(bookId)
        return book
      }
    },
    booksCount: {
      type: GraphQLInt,
      resolve: () => {
        return getBooksCount()
      }
    }
  })
})

export default GraphQLUserType
