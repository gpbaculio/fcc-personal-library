import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor, toGlobalId } from 'graphql-relay';
import { deleteComment, getBook } from '../../database';
import { GraphQLBookEdge } from '../query/objectTypes/user';
import pubSub from '../../pubSub';

const GraphQLDeleteCommentMutation = mutationWithClientMutationId({
  name: 'DeleteComment',
  inputFields: {
    commentId: { type: new GraphQLNonNull(GraphQLString) },
    bookId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async ({ commentId, bookId }) => {
    const comment = await deleteComment(fromGlobalId(commentId).id);
    const book = await getBook(fromGlobalId(bookId).id)
    pubSub.publish('commentDeleted', { commentDeleted: { commentId: comment.id, book } })
    return { commentId: comment.id, book };
  },
  outputFields: {
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
  },
});

export default GraphQLDeleteCommentMutation;
