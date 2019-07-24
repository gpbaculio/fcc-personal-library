import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { updateBookTitle } from '../../database';
import { GraphQLBookEdge } from '../query/objectTypes/user';


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
    return { book };
  },
  outputFields: {
    book: {
      type: GraphQLBookEdge,
      resolve: ({ book }) => ({ cursor: offsetToCursor(book.id), node: book }),
    }
  },
});

export default GraphQLUpdateBookTitleMutation;
