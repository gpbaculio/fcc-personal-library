import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { GraphQLCommentEdge } from '../query/objectTypes/book';
import { updateCommentText } from '../../database';


const GraphQLUpdateCommentTextMutation = mutationWithClientMutationId({
  name: 'UpdateCommentText',
  inputFields: {
    text: {
      type: new GraphQLNonNull(GraphQLString)
    },
    commentId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ text, commentId }) => {
    const comment = await updateCommentText(text, fromGlobalId(commentId).id);
    return ({ comment });
  },
  outputFields: {
    comment: {
      type: GraphQLCommentEdge,
      resolve: ({ comment }) => ({
        cursor: offsetToCursor(comment.id),
        node: comment
      }),
    }
  },
});

export default GraphQLUpdateCommentTextMutation;
