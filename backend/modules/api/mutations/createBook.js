import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
//local imports
import { createBook } from '../../database';
import pubSub from '../../pubSub';
import { createBookInputType } from './inputTypes';
import { GraphQLBookEdge } from '../query/objectTypes/user';

const GraphQLCreateBookMutation = mutationWithClientMutationId({
  name: 'CreateBook',
  inputFields: {
    input: { type: createBookInputType },
  },
  mutateAndGetPayload: ({ input: { userId, title } }) => {
    const book = createBook({ title, userId: fromGlobalId(userId).id });
    pubSub.publish('bookAdded', { bookAdded: { book } });
    return ({ book });
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

export default GraphQLCreateBookMutation;