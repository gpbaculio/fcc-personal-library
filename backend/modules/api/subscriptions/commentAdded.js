
import { withFilter } from 'graphql-subscriptions'
import { GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { offsetToCursor, fromGlobalId } from 'graphql-relay'

import { GraphQLCommentEdge } from '../query/objectTypes/book';
import pubSub from '../../pubSub';
import { getBook } from '../../database';
import { GraphQLBookEdge } from '../query/objectTypes/user';

const CommentAddedPayloadType = new GraphQLObjectType({
  name: 'CommentAddedPayload',
  fields: () => ({
    book: {
      type: GraphQLBookEdge,
      resolve: async ({ comment: { bookId } }) => {
        const book = await getBook(`${bookId}`)
        return ({
          cursor: offsetToCursor(book.id),
          node: book
        })
      },
    },
    comment: {
      type: GraphQLCommentEdge,
      resolve: ({ comment }) => ({
        cursor: offsetToCursor(comment.id),
        node: comment
      }),
    }
  })
})

const commentAdded = {
  type: CommentAddedPayloadType,
  args: {
    bookId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  subscribe: withFilter(
    () => pubSub.asyncIterator('commentAdded'),
    (payload, variables) => {
      return `${payload.commentAdded.comment.bookId}` === fromGlobalId(variables.bookId).id
    }
  )
}

export default commentAdded
