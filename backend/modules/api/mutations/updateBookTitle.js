import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { updateBookTitle } from '../../database';
import { GraphQLBookEdge } from '../query/objectTypes/user';
import pubSub from '../../pubSub';


const GraphQLUpdateBookTitleMutation = mutationWithClientMutationId({
  name: 'UpdateBookTitle',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    bookId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ title, bookId }) => {
    const book = await updateBookTitle(title, fromGlobalId(bookId).id);
    pubSub.publish('bookTitleUpdated', { bookTitleUpdated: { book } })
    return { book };
  },
  outputFields: {
    book: {
      type: GraphQLBookEdge,
      resolve: ({ book }) => ({
        cursor: offsetToCursor(book.id),
        node: book
      }),
    }
  },
});

export default GraphQLUpdateBookTitleMutation;
