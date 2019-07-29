import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { GraphQLCommentEdge } from '../query/objectTypes/book';
import { createComment, getBook } from '../../database';
import { GraphQLBookEdge } from '../query/objectTypes/user';


const GraphQLAddCommentMutation = mutationWithClientMutationId({
  name: 'AddComment',
  inputFields: {
    text: {
      type: new GraphQLNonNull(GraphQLString)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    bookId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ text, userId, bookId }) => {
    const comment = await createComment(text, fromGlobalId(userId).id, fromGlobalId(bookId).id);
    return ({ comment });
  },
  outputFields: {
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
  },
});

export default GraphQLAddCommentMutation;
