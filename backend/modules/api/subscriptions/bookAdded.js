import { GraphQLObjectType } from 'graphql'
import { offsetToCursor } from 'graphql-relay'

import { GraphQLBookEdge } from '../query/objectTypes/user';
import pubSub from '../../pubSub';

const BookAddedPayloadType = new GraphQLObjectType({
  name: 'BookAddedPayload',
  fields: () => ({
    book: {
      type: GraphQLBookEdge,
      resolve: ({ book }) => ({
        cursor: offsetToCursor(book.id),
        node: book
      }),
    }
  })
})

const bookAdded = {
  type: BookAddedPayloadType,
  subscribe: () => pubSub.asyncIterator('bookAdded')
}

export default bookAdded
