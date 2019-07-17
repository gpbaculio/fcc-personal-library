import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { updateProfilePicture } from '../../database';
import GraphQLUserType from '../query/objectTypes/user';


const GraphQLUploadProfilePictureMutation = mutationWithClientMutationId({
  name: 'UploadProfilePicture',
  inputFields: {
    profilePicture: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async (root, { request: { files } }, context) => {
    console.log('mutateAndGetPayload args req ', files)
    const viewer = await updateProfilePicture(fromGlobalId(root.userId).id, root.profilePicture);
    return { viewer };
  },
  outputFields: {
    viewer: {
      type: GraphQLUserType,
      resolve: ({ viewer }) => viewer,
    }
  },
});

export default GraphQLUploadProfilePictureMutation;
