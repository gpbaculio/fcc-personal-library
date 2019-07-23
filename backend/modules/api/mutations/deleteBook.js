import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { deleteBook } from '../../database';


const GraphQLDeleteBookMutation = mutationWithClientMutationId({
  name: 'DeleteBook',
  inputFields: {
    bookId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async ({ bookId }) => {
    const deletedBookId = await deleteBook(fromGlobalId(bookId).id);
    return { deletedBookId };
  },
  outputFields: {
    deletedBookId: {
      type: GraphQLString,
      resolve: ({ deletedBookId }) => deletedBookId,
    },
  },
});

export default GraphQLDeleteBookMutation;
