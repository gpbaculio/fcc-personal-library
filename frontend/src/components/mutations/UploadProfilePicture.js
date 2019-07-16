import graphql from 'babel-plugin-relay/macro';

import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation UploadProfilePictureMutation($input: UploadProfilePictureInput!) {
    uploadProfilePicture(input: $input) {
      viewer {
        id
        username
        profilePicture
      }
    }
  }
`)
