import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from "../createQueryRenderer";
import Home from './Home';

const HomeQR = createQueryRenderer(
  Home,
  {
    query: graphql`
      query HomeQuery {
        viewer {
          id
          ...Home_viewer
        }
      }
    `,
    variables: {},
  })

export default HomeQR