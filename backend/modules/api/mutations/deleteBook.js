import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { deleteBook, getUser } from '../../database';
import GraphQLUserType from '../query/objectTypes/user';


const GraphQLDeleteBookMutation = mutationWithClientMutationId({
  name: 'DeleteBook',
  inputFields: {
    bookId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async ({ bookId }) => {
    const book = await deleteBook(bookId);
    return { book };
  },
  outputFields: {
    deletedBookId: {
      type: GraphQLString,
      resolve: ({ book }) => toGlobalId('Book', book.id),
    },
    viewer: {
      type: GraphQLUserType,
      resolve: ({ book }) => getUser(book.userId)
    }
  },
});

export default GraphQLDeleteBookMutation;
