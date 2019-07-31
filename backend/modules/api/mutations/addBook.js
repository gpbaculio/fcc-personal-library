import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { createBook } from '../../database';
import { GraphQLBookEdge } from '../query/objectTypes/user';
import pubSub from '../../pubSub';


const GraphQLAddBookMutation = mutationWithClientMutationId({
  name: 'AddBook',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ title, userId }) => {
    const book = await createBook(title, fromGlobalId(userId).id);
    pubSub.publish('bookAdded', { bookAdded: { book } })
    return ({ book });
  },
  outputFields: {
    book: {
      type: GraphQLBookEdge,
      resolve: ({ book }) => ({
        cursor: offsetToCursor(book.id),
        node: book
      })
    }
  },
});

export default GraphQLAddBookMutation;
