import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from "../createQueryRenderer";
import { ProfileFC, Profile } from './Profile';

const ProfileQR = createQueryRenderer(
  ProfileFC,
  Profile,
  {
    query: graphql`
      query ProfileQuery($userId: String) {
        viewer(userId:$userId) {
          ...Profile_viewer
        }
      }
    `,
    queriesParams: ({
      match: { params: { userId } }
    }) => ({
      userId
    }),
    getFragmentProps: ({ viewer }) => ({
      viewer
    }),
  }
)

export default ProfileQR