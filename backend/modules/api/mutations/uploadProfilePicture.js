import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { updateProfilePicture } from '../../database';
import GraphQLUserType from '../query/objectTypes/user';
import _values from 'lodash/values'

const GraphQLUploadProfilePictureMutation = mutationWithClientMutationId({
  name: 'UploadProfilePicture',
  inputFields: {},
  mutateAndGetPayload: async (_root, { request, user }) => {
    const [imgFile] = _values(request.files)[0]
    const { viewer } = await updateProfilePicture(user._id, imgFile);
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
