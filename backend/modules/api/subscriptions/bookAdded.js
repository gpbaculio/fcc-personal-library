import { GraphQLObjectType, GraphQLString } from 'graphql'
import { withFilter } from 'graphql-subscriptions'
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
// subscribe: withFilter(
//   () => pubSub.asyncIterator('bookAdded'),
//   ({ bookAdded }, variables) => {
//     console.log('node id ', `${bookAdded.book.node.userId._id}`);
//     console.log('var id ', fromGlobalId(variables.viewerId).id)
//     console.log('variables ', `${bookAdded.book.node.userId._id}` === fromGlobalId(variables.viewerId).id);
//     return `${bookAdded.book.node.userId._id}` !== fromGlobalId(variables.viewerId).id
//   }
// )
export default bookAdded
