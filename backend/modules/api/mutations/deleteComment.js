import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { deleteComment } from '../../database';


const GraphQLDeleteCommentMutation = mutationWithClientMutationId({
  name: 'DeleteComment',
  inputFields: {
    commentId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async ({ commentId }) => {
    const deletedCommentId = await deleteComment(fromGlobalId(commentId).id);
    return { deletedCommentId };
  },
  outputFields: {
    deletedCommentId: {
      type: GraphQLString,
      resolve: ({ deletedCommentId }) => deletedCommentId,
    },
  },
});

export default GraphQLDeleteCommentMutation;
