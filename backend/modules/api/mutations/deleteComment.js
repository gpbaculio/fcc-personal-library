import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { deleteComment, getBook } from '../../database';
import { GraphQLBookEdge } from '../query/objectTypes/user';


const GraphQLDeleteCommentMutation = mutationWithClientMutationId({
  name: 'DeleteComment',
  inputFields: {
    commentId: { type: new GraphQLNonNull(GraphQLString) },
    bookId: { type: new GraphQLNonNull(GraphQLString) }
  },
  mutateAndGetPayload: async ({ commentId, bookId }) => {
    const deletedCommentId = await deleteComment(fromGlobalId(commentId).id);
    const book = await getBook(fromGlobalId(bookId).id)
    return { commentId, book };
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
      resolve: ({ commentId }) => commentId,
    }
  },
});

export default GraphQLDeleteCommentMutation;
