import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import { deleteBook, getUser } from '../../database';
import GraphQLUserType from '../query/objectTypes/user';
import pubSub from '../../pubSub';


const GraphQLDeleteBookMutation = mutationWithClientMutationId({
  name: 'DeleteBook',
  inputFields: {
    bookId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async ({ bookId }) => {
    const book = await deleteBook(bookId);
    pubSub.publish('bookDeleted', { bookDeleted: { deletedBookId: book.id } })
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
