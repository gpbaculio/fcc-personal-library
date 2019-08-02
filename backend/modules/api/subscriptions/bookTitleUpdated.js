
import { withFilter } from 'graphql-subscriptions'
import { GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { offsetToCursor, fromGlobalId } from 'graphql-relay'

import { GraphQLCommentEdge } from '../query/objectTypes/book';
import pubSub from '../../pubSub';
import { getBook } from '../../database';
import { GraphQLBookEdge } from '../query/objectTypes/user';

const BookTitleUpdatedPayloadType = new GraphQLObjectType({
  name: 'BookTitleUpdatedPayload',
  fields: () => ({
    book: {
      type: GraphQLBookEdge,
      resolve: async ({ book }) => {
        return ({
          cursor: offsetToCursor(book.id),
          node: book
        })
      },
    },
  })
})

const bookTitleUpdated = {
  type: BookTitleUpdatedPayloadType,
  args: {
    bookId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  subscribe: withFilter(
    () => pubSub.asyncIterator('bookTitleUpdated'),
    (payload, variables) => {
      return `${payload.bookTitleUpdated.book._id}` === fromGlobalId(variables.bookId).id
    }
  )
}

export default bookTitleUpdated
