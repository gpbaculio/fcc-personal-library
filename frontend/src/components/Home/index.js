import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from "../createQueryRenderer";
import { HomeFragmentContainer, Home } from './Home';

const HomeQR = createQueryRenderer(HomeFragmentContainer, Home, {
  query: graphql`
  query HomeQuery {
    viewer {
      username
      ...Home_viewer
    }
  }
`,
  queriesParams: null,
  getFragmentProps: ({ viewer }) => ({ viewer })
})

export default HomeQR