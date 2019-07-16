import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { updateProfilePicture } from '../../database';
import GraphQLUserType from '../query/objectTypes/user';


const GraphQLUploadProfilePictureMutation = mutationWithClientMutationId({
  name: 'UploadProfilePicture',
  inputFields: {
    profilePicture: {
      type: new GraphQLNonNull(GraphQLString)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ userId, profilePicture }) => {
    console.log('profilePicture ', profilePicture)
    const viewer = await updateProfilePicture(fromGlobalId(userId).id, profilePicture);
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
