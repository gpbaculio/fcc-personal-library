import { GraphQLObjectType, GraphQLString } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import pubSub from '../../pubSub';

const BookDeletedPayloadType = new GraphQLObjectType({
  name: 'BookDeletedPayload',
  fields: () => ({
    deletedBookId: {
      type: GraphQLString,
      resolve: ({ deletedBookId }) => {
        return toGlobalId('Book', deletedBookId)
      },
    }
  })
})

const bookDeleted = {
  type: BookDeletedPayloadType,
  subscribe: () => pubSub.asyncIterator('bookDeleted')
}

export default bookDeleted
