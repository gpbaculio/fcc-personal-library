import { GraphQLObjectType, GraphQLString } from 'graphql'
import { toGlobalId, offsetToCursor } from 'graphql-relay'
import pubSub from '../../pubSub';
import { GraphQLBookEdge } from '../query/objectTypes/user';

const CommentDeletedPayloadType = new GraphQLObjectType({
  name: 'CommentDeletedPayload',
  fields: () => ({
    book: {
      type: GraphQLBookEdge,
      resolve: ({ book }) => ({
        cursor: offsetToCursor(book.id),
        node: book
      }),
    },
    deletedCommentId: {
      type: GraphQLString,
      resolve: ({ commentId }) => toGlobalId('Comment', commentId),
    }
  })
})

const commentDeleted = {
  type: CommentDeletedPayloadType,
  subscribe: () => pubSub.asyncIterator('commentDeleted')
}

export default commentDeleted
