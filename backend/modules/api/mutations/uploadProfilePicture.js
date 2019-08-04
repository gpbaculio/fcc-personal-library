import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { updateProfilePicture } from '../../database';
import GraphQLUserType from '../query/objectTypes/user';
import _values from 'lodash/values'

const GraphQLUploadProfilePictureMutation = mutationWithClientMutationId({
  name: 'UploadProfilePicture',
  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ userId }, { request, user }) => {
    console.log('uplaod ', userId)
    const [imgFile] = _values(request.files)[0]
    console.log('imgFile ', imgFile)
    const { viewer } = await updateProfilePicture(fromGlobalId(userId).id, imgFile);
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
