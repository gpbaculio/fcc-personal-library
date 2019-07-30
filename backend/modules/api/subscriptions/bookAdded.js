import { GraphQLObjectType, GraphQLString } from 'graphql'
import { withFilter } from 'graphql-subscriptions'
import { fromGlobalId } from 'graphql-relay'

import { GraphQLBookEdge } from '../query/objectTypes/user';
import pubSub from '../../pubSub';

const BookAddedPayloadType = new GraphQLObjectType({
  name: 'BookAddedPayloadType',
  fields: () => ({
    book: {
      type: GraphQLBookEdge,
      resolve: ({ book }) => book,
    }
  })
})

const bookAdded = {
  type: BookAddedPayloadType,
  args: {
    viewerId: {
      type: GraphQLString
    }
  },
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