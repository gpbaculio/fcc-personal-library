
import { withFilter } from 'graphql-subscriptions'
import { GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { offsetToCursor, fromGlobalId } from 'graphql-relay'

import { GraphQLCommentEdge } from '../query/objectTypes/book';
import pubSub from '../../pubSub';

const CommentTextUpdatedPayloadType = new GraphQLObjectType({
  name: 'CommentTextUpdatedPayload',
  fields: () => ({
    comment: {
      type: GraphQLCommentEdge,
      resolve: async ({ comment }) => {
        return ({
          cursor: offsetToCursor(comment.id),
          node: comment
        })
      },
    },
  })
})

const commentTextUpdated = {
  type: CommentTextUpdatedPayloadType,
  args: {
    commentId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  subscribe: withFilter(
    () => pubSub.asyncIterator('commentTextUpdated'),
    (payload, variables) => {
      return `${payload.commentTextUpdated.comment._id}` === fromGlobalId(variables.commentId).id
    }
  )
}

export default commentTextUpdated
